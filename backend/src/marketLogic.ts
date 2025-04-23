// src/marketLogic.ts
import type { MarketState, PotionType } from "../../shared/types";

const BASELINE: Record<PotionType, number> = {
  mushroom: 3,
  flower: 2,
  herb: 4,
  fruit: 5,
};

export function updateMarketAfterTransaction(
  market: MarketState,
  type: PotionType,
  action: 'buy' | 'sell'
): MarketState {
  const newMarket = { ...market };
  const item = newMarket[type];
  const { price, stock } = item;

  const stockDelta = action === "buy" ? -1 : +1;
  const newStock = Math.max(stock + stockDelta, 0);
  item.stock = newStock;

  // Elastic pricing: magnitude depends on how far from baseline stock
  const baselineStock = BASELINE[type];
  const deviation = Math.abs(baselineStock - newStock);
  const priceChange = Math.max(1, Math.floor(deviation / 2));

  if (action === "buy") {
    item.price = Math.min(price + priceChange, 10);
  } else {
    item.price = Math.max(price - priceChange, 1);
  }

  return newMarket;
}

export function decayMarketPrices(market: MarketState): MarketState {
  const updated = { ...market };

  for (const type in BASELINE) {
    const t = type as PotionType;
    const base = BASELINE[t];
    const current = updated[t].price;
    const delta = current - base;

    if (delta > 0) {
      updated[t].price = Math.max(base, current - Math.ceil(delta / 2));
    } else if (delta < 0) {
      updated[t].price = Math.min(base, current + Math.ceil(Math.abs(delta) / 2));
    }

    // Passive restock mechanic
    if (updated[t].stock < BASELINE[t]) {
      updated[t].stock += 1;
    }
  }

  return updated;
}
