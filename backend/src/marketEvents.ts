import { MarketRumor, GameState, MarketItem } from "@shared/types";
import { generateRumor } from "./generateRumor";

/**
 * Apply random market fluctuations and generate a rumor at the start of a new turn.
 * Modifies the GameState's market prices in place and returns a new rumor.
 */
export function applyMarketEvents(state: GameState): MarketRumor {
  // 1. Random price drift for all market items (±10%)
  for (const item of Object.values(state.market.items)) {
    driftPrice(item);
  }
  // 2. Generate a new market rumor based on a random item
  const items = Object.values(state.market.items);
  if (items.length === 0) {
    // If no items in market, return a generic rumor
    return {
      id: crypto.randomUUID(),
      message: "The market is eerily empty today.",
      source: "market",
      timestamp: Date.now()
    };
  }
  const randomItem = items[Math.floor(Math.random() * items.length)];
  return generateRumor(randomItem);
}

/** Helper: apply a ±10% random price drift to a market item */
function driftPrice(item: MarketItem): void {
  const factor = 1 + (Math.random() * 0.2 - 0.1);
  item.price = Math.max(1, Math.round(item.price * factor));
}
