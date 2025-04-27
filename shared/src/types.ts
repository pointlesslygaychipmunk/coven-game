/*  shared/src/types.ts  ──────────────────────────────────────────
    central source-of-truth for every TS project in the repo
------------------------------------------------------------------ */

/* ─────────────────── time & weather ──────────────────────────── */
export type Season    = "spring" | "summer" | "autumn" | "winter";
export type Weather   = "sunny"  | "rainy"  | "stormy" | "foggy" | "cloudy";
export type MoonPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;   // eight-phase moon

/* ─────────────────── garden & crops ──────────────────────────── */
export type CropType = "mushroom" | "flower" | "herb" | "fruit";

/** one logical square of soil in a player’s garden */
export interface Tile {
  crop:   CropType | null;   // null ⇢ empty soil
  growth: number;            // 0 … 1  (0 = seed, 1 = harvestable)
  dead?:  boolean;           // crop died (optional flag)
}

/* ─────────────────── potions / economy ───────────────────────── */
export type PotionTier = "common" | "uncommon" | "rare" | "legendary";

export interface Potion {
  id:          string;
  name:        string;
  tier:        PotionTier;
  ingredients: Record<CropType, number>;
}

/* ─────────────────── player & world state ────────────────────── */
export interface Player {
  id:        string;
  name:      string;
  inventory: Record<CropType, number>;
  potions:   Potion[];
  garden:    Tile[];
  gold:      number;
  mana:      number;
}

export interface GameStatus {
  year:      number;
  moonPhase: MoonPhase;
  season:    Season;
  weather:   Weather;
}

export interface GameState {
  players: Player[];
  status:  GameStatus;
}

/* ─────────────────── player actions (client ⇢ server) ────────── */
export type Action =
  | { type: "plant";   crop: CropType; index: number }
  | { type: "harvest"; index: number }
  | { type: "water";   index: number }
  | { type: "buy";     itemId: string; quantity: number }
  | { type: "sell";    itemId: string; quantity: number }
  | { type: "brew";    recipeId: string }
  | { type: "fulfill"; requestId: string };

export type GameAction = Action;           // legacy alias (if needed)

/* ─────────────────── Rune-Crush mini-game ────────────────────── */
export type Rune = "EARTH" | "WATER" | "FIRE" | "AIR" | "AETHER" | "CATALYST";

export interface Coord { x: number; y: number }

export interface BrewMove { from: Coord; to: Coord }

export interface RecipeMeta {
  targetScore:  number;
  maxMoves:     number;
  optimalMoves: number;
}
export type Recipes = Record<string, RecipeMeta>;

export interface BrewMatch3Result {
  recipeId: string;
  seed:     string;
  moves:    BrewMove[];
  quality:  number;      // 0-1 after server verification
}
