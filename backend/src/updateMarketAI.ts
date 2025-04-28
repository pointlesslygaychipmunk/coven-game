// backend/src/updateMarketAI.ts
import { MarketItem, MarketState } from "./shared/types";

export interface MarketMemory {
  purchases: Record<string, number>;
  sales: Record<string, number>;
  trends?: Record<string, number[]>;
}

export function updateMarketAI(
  market: MarketState,
  memory: MarketMemory
): MarketState {
  const updated: MarketState = {
    items: { ...market.items },
  };

  for (const key of Object.keys(updated.items)) {
    const item = updated.items[key];
    const bought = memory.purchases[key] ?? 0;
    const sold = memory.sales[key] ?? 0;

    // Explicitly treat base as number
    const basePrice: number = item.price;

    const scarcity = 5 - (item.stock ?? 0);
    const demandBoost = Math.floor(bought * 0.3);
    const supplyDiscount = Math.floor(sold * 0.2);

    let newPrice = Math.max(1, basePrice + scarcity + demandBoost - supplyDiscount);

    if (memory.trends?.[key]) {
      const history = memory.trends[key];
      history.push(newPrice);
      if (history.length > 4) history.shift();
      const avg = history.reduce((a, b) => a + b, 0) / history.length;
      newPrice = Math.round((newPrice + avg) / 2);
    }

    updated.items[key] = {
      ...item,
      price: newPrice,
    };
  }

  return updated;
}