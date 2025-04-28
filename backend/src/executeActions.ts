import { GameState, Action, CropType, Player } from "@shared/types";
import { recordMemoryEntry } from "./modules/marketMemory";

/** Type-guard: check if a string corresponds to a CropType */
function isCropType(id: string): id is CropType {
  return ["mushroom", "flower", "herb", "fruit"].includes(id);
}

/**
 * Execute a batch of actions for a single player and update the game state accordingly.
 */
export function executeActions(
  state: GameState,
  playerId: string,
  actions: Action[]
): GameState {
  const player: Player | undefined = state.players.find((p) => p.id === playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  // Default blank ingredients record for new potions (all counts zero)
  const defaultIngredients: Record<CropType, number> = {
    mushroom: 0,
    flower: 0,
    herb: 0,
    fruit: 0
  };

  for (const action of actions) {
    if (action.type === "buy") {
      const { itemId, quantity } = action;
      const item = state.market.items[itemId];
      const price = item.currentPrice ?? item.price;

      // 1) Deduct cost from player's gold
      player.gold -= price * quantity;

      // 2) Add purchased items to player's inventory or potions
      if (isCropType(itemId)) {
        // Buying a crop/ingredient
        player.inventory[itemId] = (player.inventory[itemId] || 0) + quantity;
      } else if (item.type === "potion") {
        // Buying potions: add new potion entries
        for (let i = 0; i < quantity; i++) {
          player.potions.push({
            id: `${itemId}_${Date.now()}_${i}`,  // unique ID for each potion
            name: item.name,
            tier: item.tier,
            ingredients: { ...defaultIngredients }
          });
        }
      }
      // Black-market purchases: (could handle separately, e.g., no direct inventory addition)

      // 3) Decrease market stock
      item.stock = (item.stock || 0) - quantity;

      // 4) Log the purchase in market memory
      recordMemoryEntry(player, state.market, state.status, itemId, price, quantity);
    }

    if (action.type === "sell") {
      const { itemId, quantity } = action;
      const item = state.market.items[itemId];
      const price = item.currentPrice ?? item.price;

      // 1) Increase player's gold by sale revenue
      player.gold += price * quantity;

      // 2) Remove sold items from inventory (assume only crops can be sold for now)
      if (isCropType(itemId)) {
        player.inventory[itemId] = (player.inventory[itemId] || 0) - quantity;
      }

      // 3) Increase market stock
      item.stock = (item.stock || 0) + quantity;

      // 4) Log the sale (negative volume) in memory
      recordMemoryEntry(player, state.market, state.status, itemId, price, -quantity);
    }

    // Other action types (plant, harvest, water, fulfill, brew, etc.) 
    // would be processed here as needed. (For now, they have no direct effect in this simplified engine.)
  }

  return state;
}
