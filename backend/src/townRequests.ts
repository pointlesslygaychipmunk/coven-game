// backend/src/townRequests.ts
// Generates town requests (orders from towns) based on season and needs.

import { TownRequest, Season } from "@shared/types";

let requestCounter = 0;

// Possible request templates for different seasons (simplified)
const seasonalRequests: Record<Season, { item: string, min: number, max: number }[]> = {
  "Spring": [
    { item: "Moonbud", min: 2, max: 5 },
    { item: "Glimmerroot", min: 2, max: 5 }
  ],
  "Summer": [
    { item: "Sacred Lotus", min: 1, max: 3 },
    { item: "Moonbud", min: 1, max: 4 }
  ],
  "Fall": [
    { item: "Ancient Ginseng", min: 1, max: 2 },
    { item: "Glimmerroot", min: 2, max: 4 }
  ],
  "Winter": [
    { item: "Ancient Ginseng", min: 1, max: 3 },
    { item: "Radiant Moon Mask", min: 1, max: 1 }
  ]
};

export function generateTownRequests(currentSeason: Season): TownRequest[] {
  const templates = seasonalRequests[currentSeason] || [];
  const requests: TownRequest[] = [];
  // We'll generate 1 or 2 requests each time, randomly chosen from templates
  const count = Math.random() < 0.5 ? 1 : 2;
  for (let i = 0; i < count && templates.length > 0; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const quantity = Math.floor(Math.random() * (template.max - template.min + 1)) + template.min;
    const rewardGold = quantity * 5 + Math.floor(Math.random() * 10) + 5; // reward scales with quantity
    const rewardInfluence = Math.floor(quantity / 2) + 1; // small influence reward
    requests.push({
      id: `req${++requestCounter}`,
      item: template.item,
      quantity,
      rewardGold,
      rewardInfluence
    });
  }
  return requests;
}
