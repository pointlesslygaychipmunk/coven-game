/* ──────────────────────────────────────────────
   Covenant - canonical shared types
   (2025-04-27 final error-free version)
   ──────────────────────────────────────────── */

/* WORLD */
export type Season    = 'spring' | 'summer' | 'autumn' | 'winter';
export type Weather   = 'sunny'  | 'rainy'  | 'stormy' | 'foggy' | 'cloudy';
export type MoonPhase = 0|1|2|3|4|5|6|7;

/* CROPS / GARDEN */
export type CropType = 'mushroom' | 'flower' | 'herb' | 'fruit';
export type PotionIngredient = CropType;          // alias restored

export interface GardenSlot {
  crop   : CropType | null;
  growth : number;                 // 0‒1
  watered?: boolean;
  dead?   : boolean;

  /* ⬇ legacy fields kept so older code compiles unchanged */
  type?  : CropType;               // old save-file format
  isDead?: boolean;
}
export type Tile = GardenSlot;

/* POTIONS */
export type PotionTier = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface Potion {
  id         : string;
  name       : string;
  tier       : PotionTier;
  ingredients: Record<CropType,number>;
}

/* RUMOURS */
export interface Rumor {
  id        : string;
  message   : string;
  source    : 'market' | 'town' | 'blackMarket' | 'quest';
  timestamp : number;
}
export type MarketRumor = Pick<Rumor,'id'|'message'|'timestamp'|'source'>;

/* MARKET */
interface MarketBase { price:number; stock:number; }
export interface BasicMarketItem  extends MarketBase { type:'crop'|'ingredient'; }
export interface PotionMarketItem extends MarketBase { type:'potion'; name:string; tier:PotionTier; }
export interface BlackMarketItem  extends MarketBase { type:'blackMarket'; name:string; riskLevel:number; }
export type MarketItem = BasicMarketItem | PotionMarketItem | BlackMarketItem;
export interface MarketState { items:Record<string,MarketItem>; }

/* TOWN REQUESTS & QUESTS */
export interface TownRequestCard {
  id:string; potionNeeds:Record<CropType,number>; craftPoints:number;
  boardSlot:1|2|3|4; fulfilled?:boolean; description?:string;
}
export interface RitualQuestCard {
  id:string; title:string; description:string; goal:number;
  contributions:Record<string,number>;
  reward?:{ gold?:number; renown?:number; craftPoints?:number; uniqueItem?:string };
  fulfilled:boolean;
}

/* AUXILIARY */
export interface FamiliarPower {
  id:string; name:string; description:string;
  effect:{ type:string; value:number }; tier:number;
}
export interface MarketMemoryEntry { itemId:string; timestamp:number; price:number; volume:number; }
export type AscendancyPath = string;        // allow "" for fresh save-files
export interface AscendancyStatus { path:AscendancyPath; progress:number; unlocked:boolean; }

/* PLAYER */
export interface Player {
  id:string; name:string;
  inventory:Record<CropType,number>;
  potions:  Potion[];
  garden:   GardenSlot[];

  gold:number; mana:number;
  renown?:number; craftPoints?:number;
  upgrades?:{ well:number; cart:number; cellar:number; cauldron:number };
  wateringUsed?:number;

  journal?:string[]; rumorsHeard?:string[];
  memory?:MarketMemoryEntry[];
  familiarPowers?:FamiliarPower[];
  ascendancy?:AscendancyStatus;
}

/* GAME STATE */
export interface GameStatus { year:number; moonPhase:MoonPhase; season:Season; weather:Weather; }
export interface GameState  {
  players:Player[]; market:MarketState;
  townRequests?:TownRequestCard[]; quests?:RitualQuestCard[];
  rumors:Rumor[]; journal:string[]; status:GameStatus;
}

/* MATCH-3 BREWING */
export type Rune = 'EARTH'|'WATER'|'FIRE'|'AIR'|'AETHER'|'CATALYST';
export interface Coord{ x:number; y:number; }
export interface BrewMove{ from:Coord; to:Coord; }
export interface RecipeMeta{ targetScore:number; maxMoves:number; optimalMoves:number; }
export type Recipes = Record<string,RecipeMeta>;
export interface BrewMatch3Result { recipeId:string; seed:string; moves:BrewMove[]; quality:number; }

/* REDUCER ACTIONS */
export type Action =
  | { type:'noop' }
  | { type:'plant';   crop:CropType; index:number }
  | { type:'harvest'; index:number }
  | { type:'water';   index:number }
  | { type:'brew';    recipeId:string; result:BrewMatch3Result };
export type GameAction = Action;
