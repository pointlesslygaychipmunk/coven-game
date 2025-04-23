// backend/marketLogic.ts

import type { MarketState, PotionType } from "../../shared/types";

export interface MarketMemory {
  purchases: Record<PotionType, number>;
  sales: Record<PotionType, number>;
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
      stockChange += Math.random() < 0.75 ? 2 : 1; // restock rare items more aggressively
    } else {
      stockChange += Math.random() < 0.5 ? 0 : 1; // mild regen
    }

    // --- Player Influence ---
    stockChange -= Math.floor(bought * 0.5); // buying reduces stock more
    stockChange += Math.floor(sold * 0.25); // selling softens scarcity

    const newStock = Math.max(0, Math.min(10, item.stock + stockChange));

    // --- Price Calculation ---
    const scarcity = 5 - newStock;
    const demandBoost = Math.floor(bought * 0.3);
    const supplyDiscount = Math.floor(sold * 0.2);

    const basePrice = 3;
    const newPrice = Math.max(
      1,
      basePrice + scarcity + demandBoost - supplyDiscount
    );

    updated[type] = {
      stock: newStock,
      price: newPrice,
    };
  }

  return updated;
}