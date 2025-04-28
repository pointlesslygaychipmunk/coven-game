/*─────────────────────────────────────────────────────────────────
  Coven – canonical shared types     (2025-04-27 final clean slab)
─────────────────────────────────────────────────────────────────*/

/* WORLD */
export type Season    = 'spring'|'summer'|'autumn'|'winter';
export type Weather   = 'sunny'|'rainy'|'stormy'|'foggy'|'cloudy';
export type MoonPhase = 0|1|2|3|4|5|6|7;

/* CROPS & GARDEN */
export type CropType         = 'mushroom'|'flower'|'herb'|'fruit';
export type PotionIngredient = CropType;              // alias

export interface GardenSlot {
  /* new canonical fields */
  crop   : CropType|null;
  growth : number;                // 0‒1
  kind   : 'crop'|'tree';
  dead   : boolean;
  watered: boolean;

  /* legacy aliases so old saves & tests still compile/run */
  type?   : CropType;             // ↔ crop
  isDead? : boolean;              // ↔ dead
}
export type Tile = GardenSlot;

/* POTIONS */
export type PotionTier = 'common'|'uncommon'|'rare'|'legendary';
export interface Potion {
  id:string; name:string; tier:PotionTier;
  ingredients:Record<CropType,number>;
}

/* MARKET / ECONOMY */
export interface MarketRumor {
  id:string; message:string; source:'market'|'town'|'blackMarket'|'quest';
  timestamp:number;
}

interface MarketDynamic {
  currentPrice?:number;
  basePrice?   :number;
  volatility?  :number;
  rumors?      :MarketRumor[];
}

interface MarketBase extends MarketDynamic {
  price:number; stock:number;
}

export interface BasicMarketItem  extends MarketBase { type:'crop'|'ingredient'; }
export interface PotionMarketItem extends MarketBase { type:'potion'; name:string; tier:PotionTier; }
export interface BlackMarketItem  extends MarketBase { type:'blackMarket'; name:string; riskLevel:number; }
export type MarketItem = BasicMarketItem|PotionMarketItem|BlackMarketItem;
export interface MarketState { items:Record<string,MarketItem>; }

/* RUMORS (global) */
export interface Rumor extends MarketRumor {}           // public alias

/* TOWN REQUESTS & QUESTS */
export interface TownRequestCard {
  id:string; boardSlot:1|2|3|4;
  potionNeeds:Record<CropType,number>;
  craftPoints:number;
  fulfilled:boolean;
  description?:string;
  reward?:{ gold?:number; renown?:number; craftPoints?:number };
  season?:Season;
}

export interface RitualQuestCard {
  id:string; title:string; description:string;
  goal:number; fulfilled:boolean;
  contributions:Record<string,number>;
  reward?:{ gold?:number; renown?:number; craftPoints?:number; uniqueItem?:string };
}

/* MISC AUXILIARY */
export interface FamiliarPower {
  id:string; name:string; description:string;
  effect:{ type:string; value:number }; tier:number;
}

export interface MarketMemoryEntry {
  itemId:string; timestamp:number; price:number; volume:number;
}

export type AscendancyPath = '' | 'economicMastery'|'ritualDominance'|'secretQuest'|'rumorWeaver';
export interface AscendancyStatus { path:AscendancyPath; progress:number; unlocked:boolean; }

/* PLAYER */
export interface Player {
  id:string; name:string;

  inventory:Record<CropType,number>;
  potions  :Potion[];
  garden   :GardenSlot[];

  gold:number; mana:number;
  renown:number; craftPoints:number;
  upgrades:{ well:number; cart:number; cellar:number; cauldron:number };
  wateringUsed:number;

  journal:string[];
  rumorsHeard:string[];
  memory:MarketMemoryEntry[];
  familiarPowers:FamiliarPower[];
  ascendancy:AscendancyStatus;

  quests:RitualQuestCard[];                 // per-player quest log
}

/* GAME STATE */
export interface GameStatus { year:number; moonPhase:MoonPhase; season:Season; weather:Weather; }

export interface GameState {
  players:Player[];
  market:MarketState;
  townRequests:TownRequestCard[];
  quests:RitualQuestCard[];
  rumors:Rumor[];
  journal:string[];
  status:GameStatus;
  actionsUsed:number;
}

/* MATCH-3 BREWING */
export type Rune = 'EARTH'|'WATER'|'FIRE'|'AIR'|'AETHER'|'CATALYST';
export interface Coord { x:number; y:number; }
export interface BrewMove { from:Coord; to:Coord; }

export interface RecipeMeta { targetScore:number; maxMoves:number; optimalMoves:number; }
export type Recipes = Record<string,RecipeMeta>;

export interface BrewMatch3Result {
  recipeId:string; seed:string; moves:BrewMove[]; quality:number;
}

/* ACTION UNION (backend turn engine & reducers) */
export type Action =
  | { type:'noop' }
  | { type:'plant' ; crop:CropType; index:number }
  | { type:'harvest'; index:number }
  | { type:'water' ; index:number }
  | { type:'buy'   ; itemId:string; quantity:number }
  | { type:'sell'  ; itemId:string; quantity:number }
  | { type:'brew'  ; recipeId:string; result:BrewMatch3Result }
  | { type:'fulfill'; requestId:string }
  | { type: 'loadState'; state: GameState }
export type GameAction = Action;  // alias for older files
