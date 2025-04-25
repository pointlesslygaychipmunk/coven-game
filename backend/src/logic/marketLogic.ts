// backend/src/logic/marketLogic.ts

import {
  MarketState,
  GameStatus,
  Player,
  MarketItem
} from "../../../shared/types";

/**
 * Update market prices and stock based on current season,
 * moon phase, and player-driven factors.
 */
export function updateMarket(
  market: MarketState,
  status: GameStatus,
  players: Player[]
): MarketState {
  // 1) Base random fluctuation
  const updated: MarketState = { items: { ...market.items } };
  Object.keys(market.items).forEach((key) => {
    const item = market.items[key];
    const volatility = "volatility" in item ? item.volatility! : 0.2;
    const basePrice = ("basePrice" in item ? item.basePrice! : item.price) || 1;
    const fluctuation = (Math.random() - 0.5) * volatility * basePrice;
    const newPrice = Math.max(1, Math.round(basePrice + fluctuation));

    updated.items[key] = {
      ...item,
      currentPrice: newPrice,
      price: newPrice,
    };
  });

  // 2) Seasonal demand boost (e.g. spring flowers, winter fruits)
  const seasonalMap: Record<GameStatus["season"], keyof MarketState["items"]> = {
    spring: "flower",
    summer: "herb",
    autumn: "mushroom",
    winter: "fruit",
  };
  const boostKey = seasonalMap[status.season];
  if (updated.items[boostKey]) {
    const it = updated.items[boostKey];
    const boosted = Math.round((it.currentPrice ?? it.price) * 1.1);
    updated.items[boostKey] = { ...it, currentPrice: boosted };
  }

  // 3) Full moon premium
  if (status.moonPhase === 4) {
    Object.keys(updated.items).forEach((key) => {
      const it = updated.items[key];
      const premium = Math.round((it.currentPrice ?? it.price) * 1.05);
      updated.items[key] = { ...it, currentPrice: premium };
    });
  }

  // (Optional) 4) Player-driven modifiers could go here…

  return updated;
}