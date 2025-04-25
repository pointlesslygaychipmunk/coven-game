import { MarketState } from "../../shared/types";

export function updateMarketPrices(market: MarketState): MarketState {
  const updated: MarketState = { ...market };

  for (const key of Object.keys(market)) {
    const item = market[key];
    const volatility = item.volatility ?? 0.2;
    const base = "basePrice" in item ? item.basePrice : item.price;
    const basePrice = base ?? 3;

    const fluctuation = (Math.random() - 0.5) * volatility * basePrice;
    const newPrice = Math.round(Math.max(1, basePrice + fluctuation));

    updated[key] = {
      ...item,
      currentPrice: newPrice,
      price: newPrice,
    };
  }

  return updated;
}