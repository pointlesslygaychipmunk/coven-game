import type { MarketState, PotionType } from "../../shared/types";

export interface MarketMemory {
  purchases: Record<PotionType, number>;
  sales: Record<PotionType, number>;
  trends?: Record<PotionType, number[]>; // NEW: store last few prices
}

export function updateMarketAI(
  market: MarketState,
  memory: MarketMemory
): MarketState {
  const updated: MarketState = { ...market };

  for (const type of Object.keys(market) as PotionType[]) {
    const item = market[type];
    const bought = memory.purchases[type] ?? 0;
    const sold = memory.sales[type] ?? 0;

    // --- Stock Adjustment ---
    let stockChange = 0;
    if (item.stock < 3) {
      stockChange += Math.random() < 0.75 ? 2 : 1;
    } else {
      stockChange += Math.random() < 0.5 ? 0 : 1;
    }

    stockChange -= Math.floor(bought * 0.5);
    stockChange += Math.floor(sold * 0.25);

    const newStock = Math.max(0, Math.min(10, item.stock + stockChange));

    // --- Trend-Informed Price ---
    const scarcity = 5 - newStock;
    const demandBoost = Math.floor(bought * 0.3);
    const supplyDiscount = Math.floor(sold * 0.2);

    const basePrice = 3;
    let newPrice = Math.max(
      1,
      basePrice + scarcity + demandBoost - supplyDiscount
    );

    // Optional smoothing using trend history
    if (memory.trends?.[type]) {
      const history = memory.trends[type];
      history.push(newPrice);
      if (history.length > 4) history.shift();
      const avg = history.reduce((a, b) => a + b, 0) / history.length;
      newPrice = Math.round((newPrice + avg) / 2); // mild smoothing
    }

    updated[type] = {
      stock: newStock,
      price: newPrice
    };
  }

  return updated;
}