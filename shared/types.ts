export type CropType = "tree" | "mushroom" | "flower" | "herb" | "fruit";
export type PotionIngredient = "mushroom" | "flower" | "herb" | "fruit";
export type PotionTier = "common" | "rare" | "epic" | "legendary";
export type Season = "spring" | "summer" | "autumn" | "winter";
export type Weather = "sunny" | "rainy" | "stormy" | "foggy" | "cloudy";
export type MoonPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface GardenSlot {
  kind: "crop" | "tree";
  type: CropType;
  growth: number;
  isDead?: boolean;
}

export interface Potion {
  id: string;
  name: string;
  tier: PotionTier;
  ingredients: Record<PotionIngredient, number>;
}

export interface MarketRumor {
  id: string;
  message: string;
}

export interface BasicMarketItem {
  id: string;
  type: "ingredient" | "crop";
  price: number;
  label?: string;
  stock?: number;
  memory?: number[];
  sentiment?: number[];
  basePrice?: number;
  volatility?: number;
  currentPrice?: number;
  rumors?: MarketRumor[];
}

export interface PotionMarketItem {
  id: string;
  type: "potion";
  name: string;
  tier: PotionTier;
  price: number;
  stock?: number;
  volatility?: number;
  currentPrice?: number;
  rumors?: MarketRumor[];
  memory?: number[];
  sentiment?: number[];
}

export type MarketItem = BasicMarketItem | PotionMarketItem;
export type MarketState = Record<string, MarketItem>;

export interface Player {
  id: string;
  name: string;
  gold: number;
  renown: number;
  craftPoints: number;
  mana: number;
  inventory: Record<CropType, number>;
  garden: GardenSlot[];
  potions: Potion[];
  upgrades: string[];
  alerts: string[];
  wateringUsed: number;
}

export interface GameStatus {
  year: number;
  season: Season;
  moonPhase: MoonPhase;
  weather: Weather;
}

export interface GameState {
  players: Player[];
  market: MarketState;
  rumors: MarketRumor[];
  townRequests: any[];
  actionsUsed: number;
  status: GameStatus;
  journal: string[];
}

export interface TownRequestCard {
  id: string;
  description: string;
  reward: number;
  boardSlot: 1 | 2 | 3;
  potionNeeds: Record<string, number>;
  craftPoints: number;
  fulfilled: boolean;
  type: "standard" | "elite";
  count: number;
  season: Season;
}

export interface Action {
  type: string;
  payload?: any;
}

export type ValidationResult = 
  | { valid: true; state: GameState }
  | { valid: false; error: string };