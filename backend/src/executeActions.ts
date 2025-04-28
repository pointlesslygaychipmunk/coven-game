import type { GameState, Action, CropType, Player } from '../../shared/src/types';
import { recordMemoryEntry } from './modules/marketMemory';
import { verifyBrew } from './brewVerifier';        // verifies brewing puzzle results
import recipes from './recipes.json';              // contains brew recipe difficulty targets
import { v4 as uuidv4 } from 'uuid';

/** Type guard: is the given itemId a basic crop type? */
function isCropType(id: string): id is CropType {
  return ['mushroom', 'flower', 'herb', 'fruit'].includes(id);
}

/** Execute a list of actions for a single player (without advancing turn phase). */
export function executeActions(state: GameState, playerId: string, actions: Action[]): GameState {
  const player: Player | undefined = state.players.find(p => p.id === playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  for (const action of actions) {
    switch (action.type) {
      case 'plant': {
        const { crop, index } = action;
        const slot = player.garden[index];
        if (slot.crop) break;  // already occupied
        if ((player.inventory[crop] ?? 0) <= 0) break;  // no seed available
        // Plant the crop
        slot.crop = crop;
        slot.growth = 0;
        slot.dead = false;
        slot.watered = false;
        // Use one seed from inventory
        player.inventory[crop] -= 1;
        state.journal.push(`${player.name} planted a ${crop}.`);
        break;
      }
      case 'harvest': {
        const { index } = action;
        const slot = player.garden[index];
        if (!slot.crop) break;  // nothing to harvest
        if (!slot.dead && slot.growth >= 1) {
          // Harvest a mature crop
          player.inventory[slot.crop] = (player.inventory[slot.crop] || 0) + 1;
          state.journal.push(`${player.name} harvested a ${slot.crop}.`);
        } else if (slot.dead) {
          // Clear a withered crop (no yield)
          state.journal.push(`${player.name} cleared a withered ${slot.crop}.`);
        } else {
          // Crop not fully grown, skip harvesting (no action)
          break;
        }
        // Clear the garden slot after harvest
        slot.crop = null;
        slot.growth = 0;
        slot.dead = false;
        slot.watered = false;
        break;
      }
      case 'water': {
        const { index } = action;
        const slot = player.garden[index];
        if (!slot.crop || slot.dead) break;  // nothing to water
        slot.watered = true;
        slot.growth = Math.min(1, slot.growth + 0.1);  // instant small growth boost
        player.wateringUsed += 1;
        state.journal.push(`${player.name} watered the ${slot.crop}.`);
        break;
      }
      case 'buy': {
        const { itemId, quantity } = action;
        const item = state.market.items[itemId];
        const price = item.currentPrice ?? item.price;
        if (player.gold < price * quantity) break;  // not enough gold
        // Deduct gold cost
        player.gold -= price * quantity;
        // Add purchased goods to player
        if (isCropType(itemId)) {
          player.inventory[itemId] = (player.inventory[itemId] || 0) + quantity;
        } else if (item.type === 'potion') {
          for (let i = 0; i < quantity; i++) {
            player.potions.push({
              id: `${itemId}-${Date.now()}-${i}`,
              name: item.name,
              tier: item.tier,
              ingredients: { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
            });
          }
        } else if (item.type === 'blackMarket') {
          // Black market purchases have no immediate inventory (they trigger events later)
        }
        // Decrease market stock
        item.stock = Math.max(0, (item.stock || 0) - quantity);
        // Log memory of this transaction
        recordMemoryEntry(player, state.market, state.status, itemId, price, quantity);
        state.journal.push(`${player.name} bought ${quantity} × ${itemId} @ ${price}g.`);
        break;
      }
      case 'sell': {
        const { itemId, quantity } = action;
        const item = state.market.items[itemId];
        const price = item.currentPrice ?? item.price;
        // Only allow selling basic crops for now
        if (!isCropType(itemId)) break;
        if ((player.inventory[itemId] || 0) < quantity) break;  // not enough to sell
        // Remove items from player and add gold
        player.inventory[itemId] -= quantity;
        player.gold += price * quantity;
        // Increase market stock (supply up)
        item.stock = (item.stock || 0) + quantity;
        // Log memory of this sale (negative volume)
        recordMemoryEntry(player, state.market, state.status, itemId, price, -quantity);
        state.journal.push(`${player.name} sold ${quantity} × ${itemId} @ ${price}g.`);
        break;
      }
      case 'brew': {
        const { recipeId, result } = action;
        // Verify the brewing puzzle result (match-3 moves) for fairness
        const recipeMeta = recipes[recipeId as keyof typeof recipes];
        if (!recipeMeta) break;
        const { targetScore, maxMoves, optimalMoves } = recipeMeta;
        const quality = verifyBrew(result.seed, result.moves, { targetScore, maxMoves, optimalMoves });
        if (quality <= 0) {
          state.journal.push(`${player.name} failed to brew ${recipeId}.`);
          break;
        }
        // Brewing succeeded – create the new potion
        let potionName = recipeId;
        if (recipeId === 'moonwell_elixir') potionName = 'Moonwell Elixir';
        const newPotion = {
          id: uuidv4(),
          name: potionName,
          tier: 'legendary' as const,
          ingredients: { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
        };
        player.potions.push(newPotion);
        state.journal.push(`${player.name} brewed a ${potionName}.`);
        break;
      }
      case 'fulfill': {
        const { requestId } = action;
        const reqIndex = state.townRequests.findIndex(r => r.id === requestId);
        if (reqIndex === -1) break;
        const request = state.townRequests[reqIndex];
        if (request.fulfilled) break;
        // Check if player has a potion meeting the request needs
        const needed = request.potionNeeds;
        const potionIndex = player.potions.findIndex(potion =>
          Object.entries(needed).every(([ing, qty]) => (potion.ingredients[ing as CropType] || 0) >= qty)
        );
        if (potionIndex === -1) break;
        // Fulfill the request using that potion
        const [usedPotion] = player.potions.splice(potionIndex, 1);
        request.fulfilled = true;
        // Grant rewards
        if (request.reward) {
          if (request.reward.gold)   player.gold += request.reward.gold;
          if (request.reward.renown) player.renown += request.reward.renown;
          if (request.reward.craftPoints) player.craftPoints += request.reward.craftPoints;
        }
        state.journal.push(`${player.name} fulfilled a town request: ${request.description}.`);
        // Remove fulfilled request from active list (it will be replaced next turn)
        state.townRequests.splice(reqIndex, 1);
        break;
      }
      case 'loadState': {
        // Replace entire state (loading a saved game, for example)
        return action.state;
      }
      case 'noop':
      default:
        // Do nothing for no-op or unknown actions
        break;
    }
  }
  return state;
}
