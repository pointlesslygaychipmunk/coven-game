// backend/actions/applyBuy.ts

import type { GameState, PotionType } from "../../shared/types";
import { canUseAction, incrementActionsUsed } from "./canUseAction";

export function applyBuy(gameState: GameState, type: PotionType, quantity: number = 1): GameState {
  if (!canUseAction(gameState)) {
    gameState.player.alerts?.push("❌ You’ve already used 2 actions this moon.");
    return gameState;
  }

  const item = gameState.market[type];
  const cost = item.price * quantity;

  if (item.stock < quantity) {
    gameState.player.alerts?.push(`❌ Not enough ${type} in stock.`);
    return gameState;
  }

  if (gameState.player.gold < cost) {
    gameState.player.alerts?.push(`❌ Not enough gold to buy ${quantity} ${type}.`);
    return gameState;
  }

  // Deduct gold, add to inventory, reduce market stock
  gameState.player.gold -= cost;
  gameState.player.inventory[type] += quantity;
  gameState.market[type].stock -= quantity;

  gameState.player.alerts?.push(`🛒 Bought ${quantity} ${type} for ${cost} gold.`);
  return incrementActionsUsed(gameState);
}
