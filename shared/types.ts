// shared/types.ts

// --- Crop & Ingredient Types ---
export type CropType = "mushroom" | "flower" | "herb" | "fruit";

// --- Potion Tier ---
export type PotionTier = "common" | "rare" | "epic";

// --- Market Item Definitions ---
export interface BasicMarketItem {
  type: "crop" | "ingredient";
  price: number;
  stock: number;
  rumors?: MarketRumor[];
}

export interface PotionMarketItem {
  type: "potion";
  name: string;
  tier: PotionTier;
  price: number;
  stock: number;
  rumors?: MarketRumor[];
}

export type MarketItem = BasicMarketItem | PotionMarketItem;

export interface MarketRumor {
  message: string;
}

// --- Market State ---
export interface MarketState {
  items: Record<string, MarketItem>;
}

// --- Garden ---
export interface GardenSlot {
  type: CropType;
  kind: "crop" | "tree";
  growth: number;
  isDead?: boolean;
}

// --- Potion ---
export interface Potion {
  name: string;
  tier: PotionTier;
  ingredients: CropType[];
}

// --- Player ---
export interface Player {
  id: string;
  inventory: Record<string, number>;
  potions: Potion[];
  gold: number;
  mana: number;
  craftPoints: number;
  garden: (GardenSlot | null)[];
  upgrades: {
    well: number;
    cart: number;
    cellar: number;
    cauldron: number;
  };
  alerts?: string[];
}

// --- Town Requests ---
export interface TownRequestCard {
  id: string;
  potionNeeds: {
    mushroom: number;
    flower: number;
    herb: number;
    fruit: number;
  };
  craftPoints: number;
  boardSlot: 1 | 2 | 3 | 4;
  fulfilled?: boolean;
}

// --- Game Status ---
export interface GameStatus {
  year: number;
  moon: number;
  season: "spring" | "summer" | "autumn" | "winter";
  weather: "sunny" | "rainy" | "stormy";
}

// --- Game State ---
export interface GameState {
  players: Player[];
  market: MarketState;
  townRequests: TownRequestCard[];
  status: GameStatus;
  rumors: MarketRumor[];
}