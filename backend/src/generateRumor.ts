import { MarketRumor, MarketItem } from "@shared/types";

const templates: ((id: string) => string)[] = [
  (id) => `Whispers say ${id} will double in price by dawn…`,
  (id) => `Local druid spotted buying huge crates of ${id}.`,
  (id) => `Some merchants refuse to stock ${id} any longer.`
];

/** Pick a random rumor text template and apply it to the given itemId. */
function pickRandomRumorText(itemId: string): string {
  const fn = templates[Math.floor(Math.random() * templates.length)];
  return fn(itemId);
}

/** Generate a new MarketRumor for the given market item. */
export function generateRumor(item: MarketItem): MarketRumor {
  return {
    id: crypto.randomUUID(),
    message: pickRandomRumorText(item.type),
    source: "market",
    timestamp: Date.now()
  };
}
