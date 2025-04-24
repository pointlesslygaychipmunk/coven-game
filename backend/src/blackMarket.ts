// backend/blackMarket.ts
import type { GameState, PotionType } from "../../shared/types";

export function generateBlackMarket(): Record<PotionType, { stock: number; price: number }> {
  return {
    mushroom: { stock: 1 + Math.floor(Math.random() * 3), price: 1 + Math.floor(Math.random() * 3) },
    flower:   { stock: 1 + Math.floor(Math.random() * 3), price: 2 + Math.floor(Math.random() * 3) },
    herb:     { stock: 1 + Math.floor(Math.random() * 3), price: 2 + Math.floor(Math.random() * 3) },
    fruit:    { stock: 1 + Math.floor(Math.random() * 3), price: 3 + Math.floor(Math.random() * 4) },
  };
}

export function unlockBlackMarket(state: GameState): GameState {
  const newState = structuredClone(state);
  newState.player.blackMarketUnlocked = true;
  newState.player.blackMarketInventory = generateBlackMarket();
  newState.player.alerts?.push("🕯️ You've unlocked the Black Market. Strange wares await.");
  return newState;
}

export function purchaseFromBlackMarket(
  state: GameState,
  item: PotionType,
  quantity: number = 1
): GameState {
  const newState = structuredClone(state);
  const bmItem = newState.player.blackMarketInventory[item];

  if (!bmItem || bmItem.stock < quantity) {
    newState.player.alerts?.push(`❌ Not enough ${item} in the Black Market.`);
    return newState;
  }

  const cost = bmItem.price * quantity;
  if (newState.player.gold < cost) {
    newState.player.alerts?.push("❌ You can't afford this deal.");
    return newState;
  }

  newState.player.gold -= cost;
  newState.player.inventory[item] += quantity;
  newState.player.blackMarketInventory[item].stock -= quantity;
  newState.player.alerts?.push(`🛒 Bought ${quantity} ${item} from the Black Market.`);
  return newState;
}