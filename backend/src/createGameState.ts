// backend/src/createGameState.ts
import { v4 as uuidv4 } from "uuid";
import {
  GameState,
  Player,
  GardenSlot,
  Potion,
  MarketItem,
  MarketState,
  CropType,
  GameStatus,
  PotionTier,
} from "../../shared/types";

// Create a garden with 8 empty slots
function createEmptyGarden(): (GardenSlot | null)[] {
  return Array(8).fill(null);
}

// Create starting potions
function createStartingPotions(): Potion[] {
  return [
    {
      id: uuidv4(),
      name: "Soothing Elixir",
      tier: "common",
      ingredients: { herb: 1, flower: 0, mushroom: 0, fruit: 0 },
    },
    {
      id: uuidv4(),
      name: "Moonlight Tonic",
      tier: "common",
      ingredients: { herb: 0, flower: 1, mushroom: 0, fruit: 0 },
    },
  ];
}

// Create initial market
function createInitialMarket(): MarketState {
  const cropTypes: CropType[] = ["herb", "flower", "mushroom", "fruit"];
  const items: Record<string, MarketItem> = {};

  cropTypes.forEach((type) => {
    items[type] = {
      type: "crop",
      price: 3,
      stock: 5,
    };
  });

  return { items };
}

// Main game state initializer
export function createGameState(): GameState {
  const player: Player = {
    id: uuidv4(),
    name: "Apprentice",
    inventory: {
      herb: 1,
      flower: 1,
      mushroom: 0,
      fruit: 0,
    },
    potions: createStartingPotions(),
    gold: 5,
    mana: 2,
    craftPoints: 0,
    garden: createEmptyGarden(),
    upgrades: {
      well: 1,
      cart: 0,
      cellar: 0,
      cauldron: 0,
    },
    alerts: [],
    wateringUsed: 0,
  };

  const status: GameStatus = {
    year: 1,
    moonPhase: 0,
    season: "spring",
    weather: "sunny",
  };

  return {
    players: [player],
    market: createInitialMarket(),
    townRequests: [],
    rumors: [],
    status,
    actionsUsed: 0,
    journal: [],
  };
}