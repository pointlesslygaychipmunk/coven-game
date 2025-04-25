import { MarketItem } from "../../shared/types";

export interface MarketMemory {
  purchases: Record<string, number>;
  sales: Record<string, number>;
  trends?: Record<string, number[]>;
}

export function updateMarketAI(
  market: Record<string, MarketItem>,
  memory: MarketMemory
): Record<string, MarketItem> {
  const updated: Record<string, MarketItem> = { ...market };

  for (const key of Object.keys(market)) {
    const item = market[key];
    const bought = memory.purchases[key] ?? 0;
    const sold = memory.sales[key] ?? 0;

    const base = "basePrice" in item ? item.basePrice : item.price;
    const basePrice = base ?? 3;

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

    updated[key] = {
      ...item,
      price: newPrice,
      currentPrice: newPrice,
    };
  }

  return updated;
}