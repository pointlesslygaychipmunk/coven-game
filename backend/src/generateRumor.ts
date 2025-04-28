import { MarketItem, MarketRumor } from "../../shared/src/types";

export function generateRumor(item: MarketItem): MarketRumor {
  const label = "label" in item && item.label ? item.label : "Unknown Item";
  const direction = Math.random() > 0.5 ? "rising" : "falling";
  const message = `${label} prices may be ${direction} soon...`;
  const now = Date.now();
  const newRumors: MarketRumor[] = Array.from({ length: 3 }, () => ({
  id: crypto.randomUUID(),
  message: pickRandomRumorText(itemId),
  source: "market",
  timestamp: now,
}));
item.rumors = newRumors;

  return {
    id: crypto.randomUUID(),
    message
  };
}