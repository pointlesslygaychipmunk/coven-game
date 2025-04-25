import { MarketItem, Season } from "../../shared/types";

export function applyMarketEvents(marketItems: Record<string, MarketItem>, season: Season): void {
  for (const key in marketItems) {
    const item = marketItems[key];

    // Apply a seasonal discount to "flower" items in spring
    if ("label" in item && typeof item.label === "string" && season === "spring" && item.label.toLowerCase().includes("flower")) {
      item.currentPrice = Math.max(1, Math.round((item.currentPrice ?? item.price) * 0.8));
      item.price = item.currentPrice;
    }

    // Apply a price hike to "mushroom" items in autumn
    if ("label" in item && typeof item.label === "string" && season === "autumn" && item.label.toLowerCase().includes("mushroom")) {
      item.currentPrice = Math.round((item.currentPrice ?? item.price) * 1.2);
      item.price = item.currentPrice;
    }
  }
}