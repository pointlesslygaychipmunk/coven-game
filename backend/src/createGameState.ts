// backend/src/createGameState.ts

import { v4 as uuidv4 } from "uuid";
import {
  GameState,
  Player,
  GardenSlot,
  Potion,
  MarketItem,
  MarketState,
  TownRequestCard,
  RitualQuestCard,
  Rumor,
  GameStatus,
  CropType,
  PotionTier,
  FamiliarPower,
  AscendancyStatus,
  MarketMemoryEntry,
} from "../../shared/types";

// Create a garden with 8 empty slots
function createEmptyGarden(): GardenSlot[] {
  return Array(8).fill(null).map(() => ({
    type: "mushroom",    // placeholder until planted
    kind: "crop",
    growth: 0,
    isDead: false,
  }));
}

// Bootstrap your initial market here
function createInitialMarket(): MarketState {
  const items: Record<string, MarketItem> = {
    // example entries; replace with your actual initial items
    mushroom: { type: "crop", price: 5, stock: 20, basePrice: 5, volatility: 0.1, rumors: [] },
    flower:   { type: "crop", price: 8, stock: 15, basePrice: 8, volatility: 0.1, rumors: [] },
    herb:     { type: "ingredient", price: 12, stock: 10, basePrice: 12, volatility: 0.15, rumors: [] },
    // potions can be added similarly...
  };
  return { items };
}

export function createGameState(): GameState {
  // --- initialize player ---
  const player: Player = {
    id: uuidv4(),
    name: "Player 1",
    inventory: { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
    potions: [],
    gold: 0,
    mana: 0,
    renown: 0,
    craftPoints: 0,
    garden: createEmptyGarden(),
    upgrades: { well: 0, cart: 0, cellar: 0, cauldron: 0 },
    wateringUsed: 0,

    // new per-player fields
    journal: [],                  // personal alert log
    rumorsHeard: [],              // IDs of rumors seen
    memory: [],                   // market memory entries
    familiarPowers: [],           // unlocked familiar powers
    quests: [],                   // personal ritual quest trackers
    ascendancy: {                 // default ascendancy status
      path: "",
      progress: 0,
      unlocked: false,
    },
  };

  // --- initial global status ---
  const status: GameStatus = {
    year: 1,
    moonPhase: 0,
    season: "spring",
    weather: "sunny",
  };

  // --- assemble full game state ---
  return {
    players: [player],
    market: createInitialMarket(),
    townRequests: [] as TownRequestCard[],
    quests: [] as RitualQuestCard[],
    rumors: [] as Rumor[],
    journal: [],              // global log
    status,
    actionsUsed: 0,
  };
}