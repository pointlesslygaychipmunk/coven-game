import { MarketRumor, MarketItem } from "./shared/types";

const templates = [
  (id:string) => `Whispers say ${id} will double in price by dawn…`,
  (id:string) => `Local druid spotted buying huge crates of ${id}.`,
  (id:string) => `Some merchants refuse to stock ${id} any longer.`,
];

function pickRandomRumorText(itemId: string): string {
  const fn = templates[Math.floor(Math.random() * templates.length)];
  return fn(itemId);
}

export function generateRumor(item: MarketItem): MarketRumor {
  return {
    id:        crypto.randomUUID(),
    message:   pickRandomRumorText(item.type),
    source:    "market",
    timestamp: Date.now(),
  };
}