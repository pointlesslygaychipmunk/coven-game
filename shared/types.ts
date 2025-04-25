// --- Enums (as types) ---
export type Season = "spring" | "summer" | "autumn" | "winter";
export type Weather = "sunny" | "rainy" | "stormy" | "foggy" | "cloudy";
export type MoonPhase = number; // you mod this as 0–7, so keep numeric

// --- Crop & Ingredient Types ---
export type CropType = "mushroom" | "flower" | "herb" | "fruit";

// --- Potion Tier ---
export type PotionTier = "common" | "rare" | "epic";

// --- Action Types ---
export type Action =
  | { type: "plant"; crop: CropType; index: number }
  | { type: "harvest"; index: number }
  | { type: "buy"; item: string; quantity: number }
  | { type: "sell"; item: string; quantity: number }
  | { type: "water"; index: number }
  | { type: "brew"; potion: string }
  | { type: "fulfill"; index: number };

// --- Market Types ---
export interface MarketRumor {
  message: string;
}

export interface BasicMarketItem {
  type: "crop" | "ingredient";
  price: number;
  stock: number;
  currentPrice?: number; // ✅ add this line
  rumors?: MarketRumor[];
}

export interface PotionMarketItem {
  type: "potion";
  name: string;
  tier: PotionTier;
  price: number;
  stock: number;
  currentPrice?: number; // ✅ add this line
  rumors?: MarketRumor[];
}

export type MarketItem = BasicMarketItem | PotionMarketItem;

export interface MarketState {
  items: Record<string, MarketItem>;
}

// --- Garden Slot ---
export interface GardenSlot {
  type: CropType;
  kind: "crop" | "tree";
  growth: number;
  isDead?: boolean;
}

// --- Potion ---
export interface Potion {
  id: string;
  name: string;
  tier: PotionTier;
  ingredients: Record<CropType, number>;
}

// --- Player ---
export interface Player {
  id: string;
  name: string;
  inventory: Record<CropType, number>;
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
  wateringUsed: number;
  alerts?: string[];
}

// --- Town Requests ---
export interface TownRequestCard {
  id: string;
  potionNeeds: Record<CropType, number>;
  craftPoints: number;
  boardSlot: 1 | 2 | 3 | 4;
  fulfilled?: boolean;
}

// --- Game Status ---
export interface GameStatus {
  year: number;
  moonPhase: MoonPhase;
  season: Season;
  weather: Weather;
}

// --- Game State ---
export interface GameState {
  players: Player[];
  market: MarketState;
  townRequests: TownRequestCard[];
  status: GameStatus;
  rumors: MarketRumor[];
  journal: string[];
  actionsUsed: number;
}