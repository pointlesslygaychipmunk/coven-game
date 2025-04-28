import { MarketItem } from "./shared/types";

export function adjustBlackMarketPrices(marketItems: MarketItem[]): void {
  for (const item of marketItems) {
    if ("basePrice" in item && typeof item.basePrice === "number") {
      const volatility = item.volatility ?? 0.2;
      const changeFactor = (Math.random() - 0.5) * volatility;
      const newPrice = item.basePrice * (1 + changeFactor);
      item.currentPrice = Math.max(1, Math.round(newPrice));
      item.price = item.currentPrice; // Ensure 'price' field remains in sync
    }
  }
}