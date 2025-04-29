// backend/src/items.ts
// Define all game items (seeds, ingredients, potions) and their base prices.

import type { ItemType, MarketItem } from "@shared/types";

// Master list of game items
export const ITEMS: { id: string, name: string, type: ItemType, price: number }[] = [
  // Seeds (plantable items)
  { id: "1", name: "Moonbud Seed", type: "seed", price: 5 },
  { id: "2", name: "Glimmerroot Seed", type: "seed", price: 5 },
  // Ingredients (herbs, etc.)
  { id: "3", name: "Ancient Ginseng", type: "ingredient", price: 10 },
  { id: "4", name: "Sacred Lotus", type: "ingredient", price: 15 },
  { id: "6", name: "Moonbud", type: "ingredient", price: 8 },       // yield from Moonbud Seed
  { id: "7", name: "Glimmerroot", type: "ingredient", price: 8 },   // yield from Glimmerroot Seed
  // Potions (brewed skincare products)
  { id: "5", name: "Radiant Moon Mask", type: "potion", price: 50 },
  { id: "8", name: "Moon Glow Serum", type: "potion", price: 40 },
  { id: "9", name: "Ginseng Infusion", type: "potion", price: 45 }
];

// Generate initial market items from the master list
export function getInitialMarket(): MarketItem[] {
  return ITEMS.map(item => ({
    id: item.id,
    name: item.name,
    type: item.type,
    price: item.price,
    basePrice: item.price
  }));
}
