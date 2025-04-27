// backend/src/createGameState.ts
// ──────────────────────────────────────────────────────────────────────────────

import { v4 as uuidv4 } from "uuid";
import type {
  GameState,
  Player,
  GardenSlot,
  MarketState,
  TownRequestCard,
  RitualQuestCard,
  Rumor,
  GameStatus,
  CropType,
  Potion,
  FamiliarPower,
  AscendancyStatus,
  MarketMemoryEntry,
} from "../../shared/src/types";

// 1) Build an empty garden of 8 slots
function createEmptyGarden(): GardenSlot[] {
  return Array.from({ length: 8 }, () => ({
    type:   "mushroom",
    kind:   "crop",
    growth: 0,
  }));
}

// 2) Bootstrap the first Market
function createInitialMarket(): MarketState {
  return {
    items: {
      mushroom: { type: "crop",       price: 5,  stock: 20, basePrice:5, volatility:0.1 },
      flower:   { type: "crop",       price: 8,  stock: 15, basePrice:8, volatility:0.1 },
      herb:     { type: "ingredient", price: 12, stock: 10, basePrice:12,volatility:0.15 },
      // add more as needed…
    },
  };
}

export function createGameState(): GameState {
  // --- player seed ---
  const player: Player = {
    id:           uuidv4(),
    name:         "Player 1",
    inventory:    { mushroom:0, flower:0, herb:0, fruit:0 },
    potions:      [] as Potion[],
    gold:         0,
    mana:         0,
    renown:       0,
    craftPoints:  0,
    garden:       createEmptyGarden(),
    upgrades:     { well:0, cart:0, cellar:0, cauldron:0 },
    wateringUsed: 0,

    // optional fields initialized empty
    journal:        [],
    rumorsHeard:    [],
    memory:         [] as MarketMemoryEntry[],
    familiarPowers: [] as FamiliarPower[],
    ascendancy:     { path:"", progress:0, unlocked:false },
    quests:         [] as RitualQuestCard[],
  };

  // --- global status ---
  const status: GameStatus = {
    year:      1,
    moonPhase: 0,
    season:    "spring",
    weather:   "sunny",
  };

  // --- assemble full state ---
  return {
    players:      [player],
    market:       createInitialMarket(),
    townRequests: [] as TownRequestCard[],
    quests:       [] as RitualQuestCard[],
    rumors:       [] as Rumor[],
    journal:      [],
    status,
    actionsUsed:  0,
  };
}