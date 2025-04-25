// backend/src/createGameState.ts
import { v4 as uuidv4 } from "uuid";
import {
  GameState,
  Player,
  GardenSlot,
  Potion,
  MarketItem,
  MarketRumor,
  PotionTier,
  MarketState,
  CropType,
  GameStatus,
} from "../../shared/types";

function createEmptyGarden(): GardenSlot[] {
  return Array(8).fill(null).map(() => ({
    kind: "crop",
    type: "herb",
    growth: 0,
    isDead: false,
  }));
}

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

function createInitialMarket(): MarketState {
  const types: CropType[] = ["herb", "flower", "mushroom", "fruit"];
  const market: MarketState = {};
  types.forEach((type) => {
    market[type] = {
      id: uuidv4(),
      type: "ingredient",
      label: type,
      basePrice: 3,
      currentPrice: 3,
      price: 3,
      stock: 5,
      volatility: 0.2,
      memory: [],
      sentiment: [],
      rumors: [],
    };
  });
  return market;
}

export function createGameState(): GameState {
  const player: Player = {
    id: uuidv4(),
    name: "Apprentice",
    gold: 5,
    renown: 1,
    craftPoints: 0,
    mana: 2,
    inventory: {
      herb: 1,
      flower: 1,
      mushroom: 0,
      fruit: 0,
      // 🔧 tree removed from inventory
    },
    potions: createStartingPotions(),
    upgrades: {
      well: 1,
      cart: 0,
      cellar: 0,
      cauldron: 0,
    },
    garden: createEmptyGarden(),
    alerts: [],
    wateringUsed: 0,
  };

  const gameStatus: GameStatus = {
    year: 1,
    season: "spring",
    moonPhase: 0,
    weather: "sunny",
  };

  return {
    players: [player],
    market: createInitialMarket(),
    rumors: [],
    townRequests: [],
    actionsUsed: 0,
    journal: [],
    status: gameStatus,
  };
}