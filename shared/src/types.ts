/* ────────────────────────────────────────────────────────────────
   Canonical shared types for Coven
   ────────────────────────────────────────────────────────────── */

/* WORLD --------------------------------------------------------- */
export type Season    = 'spring' | 'summer' | 'autumn' | 'winter';
export type Weather   = 'sunny'  | 'rainy'  | 'stormy' | 'foggy'  | 'cloudy';
export type MoonPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/* CROPS / GARDEN ------------------------------------------------ */
export type CropType = 'mushroom' | 'flower' | 'herb' | 'fruit';

export interface GardenSlot {
  crop    : CropType | null;
  growth  : number;          // 0-1
  watered?: boolean;
  dead?   : boolean;
}
export type Tile = GardenSlot;

/* POTIONS ------------------------------------------------------- */
export type PotionTier = 'common' | 'uncommon' | 'rare' | 'legendary';
export type PotionIngredient = CropType;

export interface Potion {
  id         : string;
  name       : string;
  tier       : PotionTier;
  ingredients: Record<CropType, number>;
}

/* MARKET ITEMS -------------------------------------------------- */
interface MarketBase {
  price : number;
  stock : number;
}

/** crops & ingredients sold at the public stall */
export interface BasicMarketItem extends MarketBase {
  type : 'crop' | 'ingredient';
}

/** potions that players have brewed */
export interface PotionMarketItem extends MarketBase {
  type : 'potion';
  name : string;
  tier : PotionTier;
}

/** risky goods sold in the alley */
export interface BlackMarketItem extends MarketBase {
  type     : 'blackMarket';
  name     : string;
  riskLevel: number;
}

export type MarketItem = BasicMarketItem | PotionMarketItem | BlackMarketItem;
export interface MarketState { items: Record<string, MarketItem>; }

/* RUMOURS ------------------------------------------------------- */
export interface Rumor {
  id        : string;
  message   : string;
  source    : 'market' | 'town' | 'blackMarket' | 'quest';
  timestamp : number;
}
export type MarketRumor = Pick<Rumor,'id'|'message'>;

/* TOWN REQUESTS ------------------------------------------------- */
export interface TownRequestCard {
  id           : string;
  potionNeeds  : Record<CropType, number>;
  craftPoints  : number;
  boardSlot    : 1|2|3|4;
  fulfilled?   : boolean;
  description?: string;          // <<— restored so React prop compiles
}

/* RITUAL QUESTS / OTHER minor structs trimmed for brevity …      */

/* PLAYER -------------------------------------------------------- */
export interface Player {
  id       : string;
  name     : string;
  inventory: Record<CropType, number>;
  potions  : Potion[];
  garden   : GardenSlot[];
  gold     : number;
  mana     : number;
}

/* GAME STATE ---------------------------------------------------- */
export interface GameStatus {
  year     : number;
  moonPhase: MoonPhase;
  season   : Season;
  weather  : Weather;
}

export interface GameState {
  players: Player[];
  market : MarketState;
  status : GameStatus;
  journal: string[];
  rumors : Rumor[];
}

/* MATCH-3 BREWING ---------------------------------------------- */
export type Rune = 'EARTH'|'WATER'|'FIRE'|'AIR'|'AETHER'|'CATALYST';
export interface Coord { x:number; y:number; }
export interface BrewMove { from:Coord; to:Coord; }

export interface RecipeMeta { targetScore:number; maxMoves:number; optimalMoves:number; }
export type Recipes = Record<string,RecipeMeta>;

export interface BrewMatch3Result {
  recipeId: string;
  seed    : string;
  moves   : BrewMove[];
  quality : number;     // 0-1 after verification
}

/* REDUCER ACTION UNION ----------------------------------------- */
export type Action =
  | { type:'noop' }
  | { type:'plant'  ; crop:CropType; index:number }
  | { type:'harvest'; index:number }
  | { type:'water'  ; index:number }
  | { type:'brew'   ; recipeId:string; result:BrewMatch3Result };
export type GameAction = Action;