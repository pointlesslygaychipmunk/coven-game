/*─────────────────────────────────────────────────────────────────────────────
  Coven Game – Shared type layer (front-end + back-end)
─────────────────────────────────────────────────────────────────────────────*/

/* ─── Enums & primitives ─────────────────────────────────────────────────── */
export type Season     = "spring" | "summer" | "autumn" | "winter";
export type Weather    = "sunny" | "rainy" | "stormy" | "foggy" | "cloudy";
export type MoonPhase  = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type CropType   = "mushroom" | "flower" | "herb" | "fruit";
export type PotionTier = "common" | "uncommon" | "rare" | "legendary";

/* ─── Rumours ────────────────────────────────────────────────────────────── */
export interface Rumor {
  id: string;
  message: string;
  source: "market" | "town" | "blackMarket" | "quest";
  timestamp: number;
  effect?: unknown;
}
export type MarketRumor = Pick<Rumor, "id" | "message">;

/* ─── Market items ───────────────────────────────────────────────────────── */
export interface BasicMarketItem {
  /** "crop" → raw produce sold by farmers, "ingredient" → refined herb etc. */
  type: "crop" | "ingredient";
  price: number;
  stock: number;
  /** floating price used by the simulation – may differ from `price` UI shows */
  currentPrice?: number;
  basePrice?: number;
  volatility?: number;
  rumors?: MarketRumor[];
}

export interface PotionMarketItem {
  type: "potion";
  name: string;
  tier: PotionTier;
  price: number;
  stock: number;
  currentPrice?: number;
  rumors?: MarketRumor[];
}

export interface BlackMarketItem {
  type: "blackMarket";
  name: string;
  price: number;
  stock: number;
  riskLevel: number;
  currentPrice?: number;
  rumors?: MarketRumor[];
}

export type MarketItem = BasicMarketItem | PotionMarketItem | BlackMarketItem;

export interface MarketState {
  items: Record<string, MarketItem>;
}

/* ─── Garden ─────────────────────────────────────────────────────────────── */
export interface GardenSlot {
  type: CropType | null;      // null = empty soil
  kind: "crop" | "tree";
  growth: number;             // 0-1 scale (dead = -1)
  isDead?: boolean;
}

/* ─── Potions / brewing ──────────────────────────────────────────────────── */
export interface Potion {
  id: string;
  name: string;
  tier: PotionTier;
  ingredients: Record<CropType, number>;
}

/* ─── Requests, quests, powers etc. (unchanged) ─────────────────────────── */
export interface TownRequestCard {
  id: string;
  potionNeeds: Record<CropType, number>;
  craftPoints: number;
  boardSlot: 1 | 2 | 3 | 4;
  fulfilled?: boolean;
  description?: string;
  reward?: { gold?: number; renown?: number; craftPoints?: number; uniqueItem?: string };
  season?: Season;
}

export interface RitualQuestCard {
  id: string;
  title: string;
  description: string;
  contributions: Record<string, number>;
  goal: number;
  reward: { gold?: number; renown?: number; craftPoints?: number; uniqueItem?: string };
  fulfilled: boolean;
}

export interface FamiliarPower {
  id: string;
  name: string;
  description: string;
  effect: { type: string; value: number };
  tier: number;
}

export type AscendancyPath = "economicMastery" | "ritualDominance" | "secretQuest" | "rumorWeaver";

export interface AscendancyStatus {
  path: AscendancyPath;
  progress: number;
  unlocked: boolean;
}

export interface MarketMemoryEntry {
  itemId: string;
  timestamp: number;
  price: number;
  volume: number;
}

/* ─── Player / state ─────────────────────────────────────────────────────── */
export interface Player {
  id: string;
  name: string;
  inventory: Record<CropType, number>;
  potions: Potion[];
  gold: number;
  mana: number;
  renown: number;
  craftPoints: number;
  garden: GardenSlot[];
  upgrades: { well: number; cart: number; cellar: number; cauldron: number };
  wateringUsed: number;
  journal?: string[];
  rumorsHeard?: string[];
  memory?: MarketMemoryEntry[];
  familiarPowers?: FamiliarPower[];
  ascendancy?: AscendancyStatus;
  quests?: RitualQuestCard[];
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
}

/* ─── Actions & reducer helpers (front-end simulation) ───────────────────── */
export type Action =
  | { type: "plant"; crop: CropType; index: number }
  | { type: "harvest"; index: number }
  | { type: "buy"; itemId: string; quantity: number }
  | { type: "sell"; itemId: string; quantity: number }
  | { type: "water"; index: number }
  | { type: "brew"; potionId: string }
  | { type: "fulfill"; requestId: string };

export type GameAction = Action;               // backward-compat alias ✔

/* ─── Rune-Crush minigame ────────────────────────────────────────────────── */
export type Rune = "EARTH" | "WATER" | "FIRE" | "AIR" | "AETHER" | "CATALYST";

export interface Coord { x: number; y: number }

export interface BrewMove { from: Coord; to: Coord }

export interface RecipeMeta {
  targetScore: number;
  maxMoves: number;
  optimalMoves: number;
}
export type Recipes = Record<string, RecipeMeta>;

export interface BrewMatch3Result {
  recipeId: string;
  seed: string;
  moves: BrewMove[];
  quality: number;           // 0-1
}