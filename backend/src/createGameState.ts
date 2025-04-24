// backend/src/createGameState.ts

import { generateTownRequests } from "./generateTownRequests";
import type { GameState, PotionType, CropType, Season, Weather } from "../../shared/types";

// Constants
const ALL_POTIONS: PotionType[] = ["mushroom", "flower", "herb", "fruit"];
const INITIAL_SEASON: Season = "Spring";
const INITIAL_WEATHER: Weather = "Sunny";

// Helper to build an empty potion record
const emptyPotionRecord = (): Record<PotionType, number> =>
  Object.fromEntries(ALL_POTIONS.map(p => [p, 0])) as Record<PotionType, number>;

const emptyMarket = (): Record<PotionType, { price: number; stock: number }> =>
  Object.fromEntries(ALL_POTIONS.map(p => [p, { price: 3, stock: 5 }])) as Record<PotionType, { price: number; stock: number }>;

const emptyBlackMarket = (): Record<string, { price: number; stock: number }> =>
  Object.fromEntries(ALL_POTIONS.map(p => [p, { price: 5, stock: 0 }])) as Record<string, { price: number; stock: number }>;

export function createGameState(): GameState {
  return {
    player: {
      id: "player-1",
      name: "Witch Hazel",
      gold: 10,
      renown: 3,
      craftPoints: 0,
      mana: 3,
      actionsUsed: 0,
      alerts: [],
      inventory: {
        mushroom: 2,
        flower: 2,
        herb: 2,
        fruit: 2,
      },
      potions: emptyPotionRecord(),
      upgrades: {
        well: 0,
        cellar: 0,
        cart: 0,
        cauldron: 0,
      },
      garden: {
        spaces: Array(8).fill(null), // 8 empty garden plots
      },
      blackMarketUnlocked: false,
      blackMarketInventory: emptyBlackMarket(),
    },
    status: {
      year: 1,
      season: INITIAL_SEASON,
      moonPhase: 1,
      weather: INITIAL_WEATHER,
    },
    market: emptyMarket(),
    blackMarketInventory: emptyBlackMarket(),
    marketEvent: null,
    townRequests: generateTownRequests(),
    actionsUsed: 0,
    pendingActions: ["water"],
  };
}