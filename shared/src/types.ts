/* ────────────────────────────────────────────────────────────────
   Canonical shared types for Coven – single source of truth
   ────────────────────────────────────────────────────────────── */

/* WORLD --------------------------------------------------------- */
export type Season    = 'spring' | 'summer' | 'autumn' | 'winter';
export type Weather   = 'sunny'  | 'rainy'  | 'stormy' | 'foggy'  | 'cloudy';
export type MoonPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/* CROPS / GARDEN ------------------------------------------------ */
export type CropType = 'mushroom' | 'flower' | 'herb' | 'fruit';

export interface GardenSlot {
  crop   : CropType | null;
  growth : number;          // 0-1 normalised
  dead?  : boolean;
  watered?: boolean;
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

/* RUMOURS ------------------------------------------------------- */
export interface Rumor {
  id        : string;
  message   : string;
  source    : 'market' | 'town' | 'blackMarket' | 'quest';
  timestamp : number;
  effect?   : unknown;
}
export type MarketRumor = Pick<Rumor,'id'|'message'>;

/* MARKET -------------------------------------------------------- */
export interface BasicMarketItem {
  type  : 'crop' | 'ingredient';
  price : number;
  stock : number;
}
export interface PotionMarketItem extends BasicMarketItem {
  type : 'potion';
  name : string;
  tier : PotionTier;
}
export interface BlackMarketItem extends BasicMarketItem {
  type     : 'blackMarket';
  name     : string;
  riskLevel: number;
}
export type MarketItem = BasicMarketItem | PotionMarketItem | BlackMarketItem;

export interface MarketState {
  items: Record<string, MarketItem>;
}

/* TOWN REQUESTS ------------------------------------------------- */
export interface TownRequestCard {
  id          : string;
  potionNeeds : Record<CropType, number>;
  craftPoints : number;
  boardSlot   : 1|2|3|4;
  fulfilled?  : boolean;
}

/* RITUAL QUESTS ------------------------------------------------- */
export interface RitualQuestCard {
  id          : string;
  title       : string;
  description : string;
  goal        : number;
  contributions: Record<string,number>;
  fulfilled   : boolean;
}

/* FAMILIAR POWERS ---------------------------------------------- */
export interface FamiliarPower {
  id         : string;
  name       : string;
  description: string;
  effect     : { type:string; value:number };
  tier       : number;
}

/* ASCENDANCY ---------------------------------------------------- */
export interface AscendancyStatus {
  path    : string;
  progress: number;
  unlocked: boolean;
}

/* MARKET MEMORY ------------------------------------------------- */
export interface MarketMemoryEntry {
  itemId   : string;
  timestamp: number;
  price    : number;
  volume   : number;
}

/* PLAYER -------------------------------------------------------- */
export interface Player {
  id       : string;
  name     : string;
  inventory: Record<CropType, number>;
  potions  : Potion[];
  garden   : GardenSlot[];
  gold     : number;
  mana     : number;
  renown   : number;
  craftPoints: number;
  journal? : string[];
  rumorsHeard?: string[];
  memory?  : MarketMemoryEntry[];
  familiarPowers?: FamiliarPower[];
  ascendancy?    : AscendancyStatus;
}

/* GAME STATE ---------------------------------------------------- */
export interface GameStatus {
  year     : number;
  moonPhase: MoonPhase;
  season   : Season;
  weather  : Weather;
}

export interface GameState {
  players     : Player[];
  market      : MarketState;
  townRequests: TownRequestCard[];
  quests      : RitualQuestCard[];
  rumors      : Rumor[];
  journal     : string[];
  status      : GameStatus;
}

/* MATCH-3 BREWING ---------------------------------------------- */
export type Rune = 'EARTH'|'WATER'|'FIRE'|'AIR'|'AETHER'|'CATALYST';

export interface Coord { x:number; y:number; }
export interface BrewMove { from:Coord; to:Coord; }

export interface RecipeMeta {
  targetScore : number;
  maxMoves    : number;
  optimalMoves: number;
}
export type Recipes = Record<string,RecipeMeta>;

export interface BrewMatch3Result {
  recipeId: string;
  seed    : string;
  moves   : BrewMove[];
  quality : number;      // 0-1 after verification
}

/* ACTION UNION -------------------------------------------------- */
export type Action =
  | { type:'noop' }
  | { type:'plant'  ; crop:CropType; index:number }
  | { type:'harvest'; index:number }
  | { type:'water'  ; index:number }
  | { type:'buy'    ; itemId:string; quantity:number }
  | { type:'sell'   ; itemId:string; quantity:number }
  | { type:'brew'   ; recipeId:string; result:BrewMatch3Result }
  | { type:'fulfill'; requestId:string };

export type GameAction = Action;   // legacy alias