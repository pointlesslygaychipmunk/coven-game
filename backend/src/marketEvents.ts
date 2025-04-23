// backend/marketEvents.ts

import type { MarketState, PotionType, Season } from "../../shared/types";

interface MarketEvent {
  name: string;
  description: string;
  apply: (market: MarketState) => MarketState;
}

const allEvents: MarketEvent[] = [
  {
    name: "Full Moon Surge",
    description: "Herbs surge in mystical potency. Prices soar!",
    apply: (market) => {
      const updated = { ...market };
      updated.herb.price += 2;
      return updated;
    }
  },
  {
    name: "Drought",
    description: "Supplies are tight. Crops fail to flourish.",
    apply: (market) => {
      const updated = { ...market };
      for (const type of Object.keys(updated) as PotionType[]) {
        updated[type].stock = Math.max(0, updated[type].stock - 2);
      }
      return updated;
    }
  },
  {
    name: "Abundant Bloom",
    description: "Flowers burst across the land. Stocks overflow.",
    apply: (market) => {
      const updated = { ...market };
      updated.flower.stock = Math.min(10, updated.flower.stock + 3);
      return updated;
    }
  },
  {
    name: "Cauldron Fever",
    description: "Potion demand spikes. Prices rise for all.",
    apply: (market) => {
      const updated = { ...market };
      for (const type of Object.keys(updated) as PotionType[]) {
        updated[type].price += 1;
      }
      return updated;
    }
  },
  {
    name: "Black Market Boom",
    description: "Secret deals abound. Prices shift wildly.",
    apply: (market) => {
      const updated = { ...market };
      for (const type of Object.keys(updated) as PotionType[]) {
        updated[type].price = Math.max(1, Math.floor(updated[type].price * 0.5));
        updated[type].stock = Math.min(10, updated[type].stock + 2);
      }
      return updated;
    }
  }
];

export function generateMarketEvent(season: Season, moonPhase: number): MarketEvent | null {
  const phaseModifier = moonPhase === 3 ? 0.15 : 0; // Full moon bonus

  let baseChance = 0.25; // Default 25% event chance

  if (season === "Winter") baseChance += 0.1;
  else if (season === "Spring") baseChance -= 0.05;

  const roll = Math.random();
  if (roll >= baseChance + phaseModifier) return null;

  const index = Math.floor(Math.random() * allEvents.length);
  return allEvents[index];
}

export type { MarketEvent };
export const marketEvents = allEvents;