// shared/types.ts
// ──────────────────────────────────────────────────────────────────────────────

// --- Enums (as types) ---
export type Season    = "spring" | "summer" | "autumn" | "winter";
export type Weather   = "sunny" | "rainy" | "stormy" | "foggy" | "cloudy";
export type MoonPhase = number; // 0–7

// --- Crop & Ingredient Types ---
export type CropType         = "mushroom" | "flower" | "herb" | "fruit";
export type PotionIngredient = CropType;

// --- Potion Tier ---
export type PotionTier = 'common' | 'uncommon' | 'rare' | 'legendary';

// --- Action Types ---
export type Action =
  | { type: "plant"; crop: CropType; index: number }
  | { type: "harvest"; index: number }
  | { type: "buy"; itemId: string; quantity: number }
  | { type: "sell"; itemId: string; quantity: number }
  | { type: "water"; index: number }
  | { type: "brew"; potionId: string }
  | { type: "fulfill"; requestId: string };

// --- Rumors ---
export interface Rumor {
  id:        string;
  message:   string;
  source:    "market" | "town" | "blackMarket" | "quest";
  effect?:   any;
  timestamp: number;
}
export type MarketRumor = Pick<Rumor, "id" | "message">;

// --- Market Items ---
export interface BasicMarketItem {
  type:       "crop" | "ingredient";
  price:      number;
  stock:      number;
  currentPrice?: number;
  basePrice?:    number;
  volatility?:   number;
  rumors?:       Pick<Rumor,"id"|"message">[];
}

export interface PotionMarketItem {
  type:       "potion";
  name:       string;
  tier:       PotionTier;
  price:      number;
  stock:      number;
  currentPrice?: number;
  rumors?:       Pick<Rumor,"id"|"message">[];
}

export interface BlackMarketItem {
  type:       "blackMarket";
  name:       string;
  price:      number;
  stock:      number;
  riskLevel:  number;
  currentPrice?: number;
  rumors?:       Pick<Rumor,"id"|"message">[];
}

export type MarketItem = BasicMarketItem | PotionMarketItem | BlackMarketItem;
export interface MarketState {
  items: Record<string,MarketItem>;
}

// --- Garden Slot ---
export interface GardenSlot {
  type:    CropType;
  kind:    "crop" | "tree";
  growth:  number;
  isDead?: boolean;
}

// --- Potion ---
export interface Potion {
  id:          string;
  name:        string;
  tier:        PotionTier;
  ingredients: Record<CropType,number>;
}

// --- Town Requests ---
export interface TownRequestCard {
  id:          string;
  potionNeeds: Record<CropType,number>;
  craftPoints: number;
  boardSlot:   1|2|3|4;
  fulfilled?:  boolean;
  description?: string;
  reward?: {
    gold?:       number;
    renown?:     number;
    craftPoints?:number;
    uniqueItem?: string;
  };
  season?: Season;
}

// --- Ritual Quests ---
export interface RitualQuestCard {
  id:            string;
  title:         string;
  description:   string;
  contributions: Record<string,number>;
  goal:          number;
  reward: {
    gold?:        number;
    renown?:      number;
    craftPoints?: number;
    uniqueItem?:  string;
  };
  fulfilled:     boolean;
}

// --- Familiar Powers ---
export interface FamiliarPower {
  id:          string;
  name:        string;
  description: string;
  effect:      { type:string; value:number };
  tier:        number;
}

// --- Ascendancy ---
export type AscendancyPath = 
  | "economicMastery" | "ritualDominance" | "secretQuest" | "rumorWeaver"
  | string;

export interface AscendancyStatus {
  path:     AscendancyPath;
  progress: number;
  unlocked: boolean;
}

// --- Market Memory ---
export interface MarketMemoryEntry {
  itemId:    string;
  timestamp: number;
  price:     number;
  volume:    number;
}

// --- Player ---
export interface Player {
  id:             string;
  name:           string;
  inventory:      Record<CropType,number>;
  potions:        Potion[];
  gold:           number;
  mana:           number;
  renown:         number;
  craftPoints:    number;
  garden:         GardenSlot[];
  upgrades:       { well:number; cart:number; cellar:number; cauldron:number };
  wateringUsed:   number;
  journal?:       string[];
  rumorsHeard?:   string[];
  memory?:        MarketMemoryEntry[];
  familiarPowers?:FamiliarPower[];
  ascendancy?:    AscendancyStatus;
  quests?:        RitualQuestCard[];
}

// --- Game Status & Full State ---
export interface GameStatus {
  year:      number;
  moonPhase: MoonPhase;
  season:    Season;
  weather:   Weather;
}

export interface GameState {
  players:      Player[];
  market:       MarketState;
  townRequests: TownRequestCard[];
  quests:       RitualQuestCard[];
  rumors:       Rumor[];
  journal:      string[];
  status:       GameStatus;
  actionsUsed:  number;
}

/* ----------------------------------------------------------------
   Rune-Crush brewing puzzle
----------------------------------------------------------------- */

export type Rune = 'EARTH' | 'WATER' | 'FIRE' | 'AIR' | 'AETHER' | 'CATALYST';

/** string-indexed map of recipe metadata loaded from recipes.json */
export interface RecipeMeta {
    targetScore:   number;
    maxMoves:      number;
    optimalMoves:  number;
  }
  export type Recipes = Record<string, RecipeMeta>;

export interface Coord {
  x: number;     // 0-based column
  y: number;     // 0-based row
}

export interface BrewMove {
  /** swap source → target (must be orthogonally adjacent) */
  from: Coord;
  to:   Coord;
}

export interface BrewMatch3Result {
  recipeId: string;
  seed: string;
  moves: BrewMove[];      // ≤ maxMoves defined by recipe
  /** quality 0–1 after server verification */
  quality: number;
}

export enum TileKind {
  Empty   = "empty",
  Crop    = "crop",
  Sprout  = "sprout",
  Dead    = "dead"
}

/**  one cell in the garden matrix */
export interface Tile {
  id:   string;           // deterministic UUID per slot
  kind: TileKind;         // lifecycle state
  crop: CropType | null;  // null when empty / dead
  age:  number;           // 0–100 growth %

  // 🔄 ADD – at the bottom of the file ––––––––––––––––––––––––––––––––––
/** A single logical square rendered by <GardenGrid/> */
export interface Tile {
  /** what’s planted here (or null for empty) */
  type: CropType | null;
  /** 0 – 1 fraction to full maturity */
  growth: number;
  /** set by the server when the plant has died */
  isDead?: boolean;
}

/* a lot of existing code used GardenSlot – keep that working */
export type GardenSlot = Tile;           // ❇ soft alias
