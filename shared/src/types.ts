export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Weather = 'sunny' | 'rainy' | 'stormy' | 'foggy' | 'cloudy' | 'snowy';
export type MoonPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type CropType = 'mushroom' | 'flower' | 'herb' | 'fruit';
export type PotionIngredient = CropType;

export type Rune = 'earth' | 'water' | 'fire' | 'air' | 'aether';

export interface Coord {
  x: number;
  y: number;
}

export interface GardenSlot {
  crop: CropType | null;
  growth: number;
  kind: 'crop' | 'tree';
  dead: boolean;
  watered: boolean;
}

export type Tile = GardenSlot;

export type PotionTier = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface Potion {
  id: string;
  name: string;
  tier: PotionTier;
  ingredients: Record<CropType, number>;
}

export interface MarketRumor {
  id: string;
  message: string;
  source: 'market' | 'town' | 'blackMarket' | 'quest';
  timestamp: number;
}

interface MarketBase {
  price: number;
  stock: number;
  currentPrice?: number;
  basePrice?: number;
  volatility?: number;
  rumors?: MarketRumor[];
}

export interface BasicMarketItem extends MarketBase {
  type: 'crop' | 'ingredient';
}

export interface PotionMarketItem extends MarketBase {
  type: 'potion';
  name: string;
  tier: PotionTier;
}

export interface BlackMarketItem extends MarketBase {
  type: 'blackMarket';
  name: string;
  riskLevel: number;
}

export type MarketItem = BasicMarketItem | PotionMarketItem | BlackMarketItem;

export interface MarketState {
  items: Record<string, MarketItem>;
}

export interface Rumor extends MarketRumor {}

export interface TownRequestCard {
  id: string;
  boardSlot: 1 | 2 | 3 | 4;
  potionNeeds: Record<CropType, number>;
  craftPoints: number;
  fulfilled: boolean;
  description?: string;
  reward?: { gold?: number; renown?: number; craftPoints?: number };
  season?: Season;
}

export interface RitualQuestCard {
  id: string;
  title: string;
  description: string;
  goal: number;
  fulfilled: boolean;
  contributions: Record<string, number>;
  reward?: { gold?: number; renown?: number; craftPoints?: number; uniqueItem?: string };
}

export interface FamiliarPower {
  id: string;
  name: string;
  description: string;
  effect: { type: string; value: number };
  tier: number;
}

export interface MarketMemoryEntry {
  itemId: string;
  timestamp: number;
  price: number;
  volume: number;
}

export type AscendancyPath = '' | 'economicMastery' | 'ritualDominance' | 'secretQuest' | 'rumorWeaver';

export interface AscendancyStatus {
  path: AscendancyPath;
  progress: number;
  unlocked: boolean;
}

export interface Player {
  id: string;
  name: string;
  inventory: Record<CropType, number>;
  potions: Potion[];
  garden: GardenSlot[];
  gold: number;
  mana: number;
  renown: number;
  craftPoints: number;
  upgrades: { well: number; cart: number; cellar: number; cauldron: number };
  wateringUsed: number;
  journal: string[];
  rumorsHeard: string[];
  memory: MarketMemoryEntry[];
  familiarPowers: FamiliarPower[];
  ascendancy: AscendancyStatus;
  quests: RitualQuestCard[];
}

export interface GameStatus {
  year: number;
  moonPhase: MoonPhase;
  season: Season;
  weather: Weather;
}

export interface GameState {
  players: Player[];
  market: MarketState;
  townRequests: TownRequestCard[];
  quests: RitualQuestCard[];
  rumors: Rumor[];
  journal: string[];
  status: GameStatus;
  actionsUsed: number;
  currentPlayer: number;
}

export interface BrewMove {
  from: Coord;
  to: Coord;
}

export interface BrewMatch3Result {
  recipeId: string;
  seed: string;
  moves: BrewMove[];
  quality: number;
}

export type Action =
  | { type: 'plant'; crop: CropType; index: number }
  | { type: 'harvest'; index: number }
  | { type: 'water'; index: number }
  | { type: 'buy'; itemId: string; quantity: number }
  | { type: 'sell'; itemId: string; quantity: number }
  | { type: 'brew'; recipeId: string; result: BrewMatch3Result }
  | { type: 'fulfill'; requestId: string }
  | { type: 'loadState'; state: GameState }
  | { type: 'noop' };

export type GameAction = Action;
