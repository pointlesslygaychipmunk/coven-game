import { MarketItem, Rumor } from "@shared/types";

export function generateRumors(items: MarketItem[]): Rumor[] {
  return items.map(item => ({
    id: crypto.randomUUID(),
    message: `Rumor spreads: ${item.type} market is unstable!`,
    source: "market",
    timestamp: Date.now()
  }));
}
