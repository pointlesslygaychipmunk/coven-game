/* ────────────────────────────────────────────────────────────────────────────
   Coven Game – shared domain model
   Everything here is **library-safe** (no browser or Node globals) so both
   backend and frontend can import it without transpiler magic.
   ───────────────────────────────────────────────────────────────────────── */

/* --------------------------------------------------------------------------
   World / environment
--------------------------------------------------------------------------- */
export type Season    = 'spring' | 'summer' | 'autumn' | 'winter';
export type Weather   = 'sunny'  | 'rainy'  | 'stormy' | 'foggy'  | 'cloudy';
export type MoonPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/* --------------------------------------------------------------------------
   Crops, potions, tiers
--------------------------------------------------------------------------- */
export type CropType         = 'mushroom' | 'flower' | 'herb' | 'fruit';
export type PotionIngredient = CropType;

export type PotionTier = 'common' | 'uncommon' | 'rare' | 'legendary';

/* --------------------------------------------------------------------------
   Basic grid / garden
--------------------------------------------------------------------------- */

/** Cell in the visible 2-D garden grid */
export interface Tile {
  /** 0-based column (x) and row (y) within the grid */
  x: number;
  y: number;

  /** What’s growing on this tile (or `null` if empty) */
  crop: CropType | null;

  /** 0–100 % growth progress. 100 == ready to harvest */
  growth: number;

  /** recently watered, influences growth speed */
  watered: boolean;

  /** true if the crop died (wilted or diseased) */
  dead?: boolean;
}

/** Slimmer record used when persisting garden state for a **single** player */
export interface GardenSlot {
  type: CropType;
  kind: 'crop' | 'tree';
  growth: number;
  watered?: boolean;
  isDead?: boolean;
}

/* --------------------------------------------------------------------------
   Player inventory & market
--------------------------------------------------------------------------- */
export interface BasicMarketItem {
  type: 'crop' | 'ingredient';
  price: number;
  stock: number;
  basePrice?: number;
  volatility?: number;
  rumors?: Pick<Rumor, 'id' | 'message'>[];
}

export interface PotionMarketItem {
  type: 'potion';
  name: string;
  tier: PotionTier;
  price: number;
  stock: number;
  rumors?: Pick<Rumor, 'id' | 'message'>[];
  currentPrice?: number; 
}

export interface BlackMarketItem {
  type: 'blackMarket';
  name: string;
  price: number;
  stock: number;
  riskLevel: number;
  rumors?: Pick<Rumor, 'id' | 'message'>[];
  currentPrice?: number; 
}

export type MarketItem = BasicMarketItem | PotionMarketItem | BlackMarketItem;

export interface MarketState {
  items: Record<string, MarketItem>;
}

/* --------------------------------------------------------------------------
   Potions & brewing
--------------------------------------------------------------------------- */
export interface Potion {
  id: string;
  name: string;
  tier: PotionTier;
  /** example: { herb: 2, mushroom: 1 } */
  ingredients: Record<CropType, number>;
}

/* --------------------------------------------------------------------------
   Town requests & quests
--------------------------------------------------------------------------- */
export interface TownRequestCard {
  id: string;
  potionNeeds: Record<CropType, number>;
  craftPoints: number;
  boardSlot: 1 | 2 | 3 | 4;
  fulfilled?: boolean;
  description?: string;
  reward?: {
    gold?: number;
    renown?: number;
    craftPoints?: number;
    uniqueItem?: string;
  };
  season?: Season;
}

export interface RitualQuestCard {
  id: string;
  title: string;
  description: string;
  contributions: Record<string, number>;
  goal: number;
  reward: {
    gold?: number;
    renown?: number;
    craftPoints?: number;
    uniqueItem?: string;
  };
  fulfilled: boolean;
}

/* --------------------------------------------------------------------------
   Rumor & news system
--------------------------------------------------------------------------- */
export interface Rumor {
  id: string;
  message: string;
  source: 'market' | 'town' | 'blackMarket' | 'quest';
  effect?: any;
  timestamp: number;
}
export type MarketRumor = Pick<Rumor, 'id' | 'message'>;

/* --------------------------------------------------------------------------
   Familiar powers / ascendancy
--------------------------------------------------------------------------- */
export interface FamiliarPower {
  id: string;
  name: string;
  description: string;
  effect: { type: string; value: number };
  tier: number;
}

export type AscendancyPath =
  | 'economicMastery'
  | 'ritualDominance'
  | 'secretQuest'
  | 'rumorWeaver'
  | string;

export interface AscendancyStatus {
  path: AscendancyPath;
  progress: number;
  unlocked: boolean;
}

/* --------------------------------------------------------------------------
   Player & game-state top level
--------------------------------------------------------------------------- */
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

export interface MarketMemoryEntry {
  itemId: string;
  timestamp: number;
  price: number;
  volume: number;
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

/* --------------------------------------------------------------------------
   Rune-Crush brewing puzzle
--------------------------------------------------------------------------- */
export type Rune = 'EARTH' | 'WATER' | 'FIRE' | 'AIR' | 'AETHER' | 'CATALYST';

export interface RecipeMeta {
  targetScore: number;
  maxMoves: number;
  optimalMoves: number;
}
export type Recipes = Record<string, RecipeMeta>;

export interface Coord {
  x: number; // 0-based column
  y: number; // 0-based row
}

export interface BrewMove {
  from: Coord; // must be orthogonally adjacent
  to: Coord;
}

export interface BrewMatch3Result {
  recipeId: string;
  seed: string;
  moves: BrewMove[];
  /** quality range 0–1 after server verification */
  quality: number;
}

/** -------------------------  helper aliases  ------------------------- */
export type Action =
  | { type: "plant"; crop: CropType; index: number }
  | { type: "harvest"; index: number }
  | { type: "buy"; itemId: string; quantity: number }
  | { type: "sell"; itemId: string; quantity: number }
  | { type: "water"; index: number }
  | { type: "brew"; potionId: string }
  | { type: "fulfill"; requestId: string };

export type GameAction = Action;