// backend/src/executeActions.ts

import { GameState, Action, CropType } from "../shared/types";
import { recordMemoryEntry } from "./modules/marketMemory";

/** Type‐guard: is this ID a garden crop? */
function isCropType(id: string): id is CropType {
  return ["mushroom", "flower", "herb", "fruit"].includes(id);
}

/**
 * Execute a batch of actions for a single player.
 */
export function executeActions(
  state: GameState,
  playerId: string,
  actions: Action[]
): GameState {
  const player = state.players.find((p) => p.id === playerId);
  if (!player) throw new Error(`Player ${playerId} not found`);

  // Default empty ingredients for potions
  const defaultIngredients: Record<CropType, number> = {
    mushroom: 0,
    flower: 0,
    herb: 0,
    fruit: 0,
  };

  for (const action of actions) {
    if (action.type === "buy") {
      const { itemId, quantity } = action;
      const item = state.market.items[itemId];
      const price = item.currentPrice ?? item.price;

      // Deduct cost
      player.gold -= price * quantity;

      // Add to inventory or create potion(s)
      if (isCropType(itemId)) {
        player.inventory[itemId] = (player.inventory[itemId] || 0) + quantity;
      } else if (item.type === "potion") {
        for (let i = 0; i < quantity; i++) {
          player.potions.push({
            id: `${itemId}_${Date.now()}_${i}`,
            name: item.name,
            tier: item.tier,
            ingredients: { ...defaultIngredients },
          });
        }
      }
      // Black-market buys go into memory/rumors only

      // Adjust market stock
      item.stock = (item.stock || 0) - quantity;

      // Record memory
      recordMemoryEntry(
        player,
        state.market,
        state.status,
        itemId,
        price,
        quantity
      );
    }

    if (action.type === "sell") {
      const { itemId, quantity } = action;
      const item = state.market.items[itemId];
      const price = item.currentPrice ?? item.price;

      // Add revenue
      player.gold += price * quantity;

      // Remove from inventory (only crops)
      if (isCropType(itemId)) {
        player.inventory[itemId] = (player.inventory[itemId] || 0) - quantity;
      }

      // Adjust market stock
      item.stock = (item.stock || 0) + quantity;

      // Record sale with negative volume
      recordMemoryEntry(
        player,
        state.market,
        state.status,
        itemId,
        price,
        -quantity
      );
    }

    // Other action types ignored here
  }

  return state;
}