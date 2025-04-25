// shared/types.ts

// --- Crop & Ingredient Types ---
export type CropType = "mushroom" | "flower" | "herb" | "fruit";

// --- Potion Tier ---
export type PotionTier = "common" | "rare" | "epic";

// --- Market Item Types ---
export interface BasicMarketItem {
  type: "crop" | "ingredient";
  price: number;
  stock: number;
  rumors?: { message: string }[];
}

export interface PotionMarketItem {
  type: "potion";
  name: string;
  tier: PotionTier;
  price: number;
  stock: number;
  rumors?: { message: string }[];
}

export type MarketItem = BasicMarketItem | PotionMarketItem;

// --- Market State ---
export interface MarketState {
  items: { [key: string]: MarketItem }; // Allows both basic and potion items
}

// --- Example Player and GameState types for context (optional) ---
export interface Player {
  inventory: Record<string, number>;
  potions: { name: string }[];
  gold: number;
  mana: number;
  craftPoints: number;
  upgrades: {
    well: number;
    [key: string]: number;
  };
  garden: (GardenSlot | null)[];
  alerts?: string[];
}

export interface GardenSlot {
  type: CropType;
  kind: "crop" | "tree";
  growth: number;
  isDead?: boolean;
}

export interface GameState {
  players: Player[];
  market?: MarketState;
  townRequests: TownRequestCard[];
  status: {
    year: number;
    moon: number;
    season: "spring" | "summer" | "autumn" | "winter";
    weather: "sunny" | "rainy" | "stormy";
  };
}

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