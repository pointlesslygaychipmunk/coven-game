/*─────────────────────────────────────────────────────────────────────────────
  shared/src/types.ts               – canonical game-wide type definitions
─────────────────────────────────────────────────────────────────────────────*/

/* ╭──────────────────────────╮
   │   Time & World Settings  │
   ╰──────────────────────────╯ */
   export type Season    = 'spring' | 'summer' | 'autumn' | 'winter';
   export type Weather   = 'sunny'  | 'rainy'  | 'stormy' | 'foggy' | 'cloudy';
   export type MoonPhase = number;           // 0‥7  (0 = new, 4 = full)
   
   /* ╭──────────────────────────╮
      │     Garden & Crops       │
      ╰──────────────────────────╯ */
   export type CropType = 'mushroom' | 'flower' | 'herb' | 'fruit';
   
   /** A single logical square in the garden grid. */
   export interface GardenSlot {
     /** What’s growing here (null ⇒ empty soil). */
     type: CropType | null;
     /** “crop” = annual plant, “tree” = permanent (for future expansion). */
     kind: 'crop' | 'tree';
     /** 0‥1 — how far along growth is. */
     growth: number;
     /** Non-existent ⇒ alive; true ⇒ dead & needs clearing. */
     dead?: boolean;
   }
   
   /* Legacy alias so existing React components keep compiling. */
   export type Tile = GardenSlot;
   
   /* ╭──────────────────────────╮
      │       Economy            │
      ╰──────────────────────────╯ */
   export type PotionTier = 'common' | 'uncommon' | 'rare' | 'legendary';
   
   export interface Potion {
     id:          string;
     name:        string;
     tier:        PotionTier;
     ingredients: Record<CropType, number>;
   }
   
   /** What the player sees in the market UI. */
   export interface BasicMarketItem {
     type:        'crop' | 'ingredient';
     price:       number;
     stock:       number;
     /* optional dynamic fields */
     currentPrice?: number;
     basePrice?:    number;
     volatility?:   number;
     rumors?:       RumorPreview[];
   }
   
   export interface PotionMarketItem {
     type:   'potion';
     name:   string;
     tier:   PotionTier;
     price:  number;
     stock:  number;
     currentPrice?: number;
     rumors?:       RumorPreview[];
   }
   
   export interface BlackMarketItem {
     type:   'blackMarket';
     name:   string;
     price:  number;
     stock:  number;
     riskLevel: number;          // 0‥10
     currentPrice?: number;
     rumors?:       RumorPreview[];
   }
   
   export type MarketItem   = BasicMarketItem | PotionMarketItem | BlackMarketItem;
   export interface MarketState { items: Record<string, MarketItem>; }
   
   /* ╭──────────────────────────╮
      │        Rumors            │
      ╰──────────────────────────╯ */
   export interface Rumor {
     id:        string;
     message:   string;
     source:    'market' | 'town' | 'blackMarket' | 'quest';
     effect?:   any;
     timestamp: number;
   }
   /** trimmed variant frequently displayed in UI lists */
   export type RumorPreview = Pick<Rumor, 'id' | 'message'>;
   
   /* ╭──────────────────────────╮
      │       Town Requests      │
      ╰──────────────────────────╯ */
   export interface TownRequestCard {
     id:           string;
     potionNeeds:  Record<CropType, number>;
     craftPoints:  number;
     boardSlot:    1 | 2 | 3 | 4;
     fulfilled?:   boolean;
     description?: string;
     reward?:      { gold?: number; renown?: number; craftPoints?: number; uniqueItem?: string };
     season?:      Season;
   }
   
   /* ╭──────────────────────────╮
      │      Ritual Quests       │
      ╰──────────────────────────╯ */
   export interface RitualQuestCard {
     id:          string;
     title:       string;
     description: string;
     contributions: Record<string, number>;
     goal:        number;
     reward:      { gold?: number; renown?: number; craftPoints?: number; uniqueItem?: string };
     fulfilled:   boolean;
   }
   
   /* ╭──────────────────────────╮
      │     Familiar Powers      │
      ╰──────────────────────────╯ */
   export interface FamiliarPower {
     id:          string;
     name:        string;
     description: string;
     effect:      { type: string; value: number };
     tier:        number;
   }
   
   /* ╭──────────────────────────╮
      │       Player Sheet       │
      ╰──────────────────────────╯ */
   export interface Player {
     id:          string;
     name:        string;
   
     /* resources */
     inventory:   Record<CropType, number>;
     potions:     Potion[];
     gold:        number;
     mana:        number;
     renown:      number;
     craftPoints: number;
   
     /* estate */
     garden:      GardenSlot[];
     upgrades:    { well: number; cart: number; cellar: number; cauldron: number };
   
     /* progression & flavour */
     wateringUsed:   number;
     journal?:       string[];
     rumorsHeard?:   string[];
     memory?:        MarketMemoryEntry[];
     familiarPowers?:FamiliarPower[];
     ascendancy?:    AscendancyStatus;
     quests?:        RitualQuestCard[];
   }
   
   /* ╭──────────────────────────╮
      │     Derived Structures   │
      ╰──────────────────────────╯ */
   export interface MarketMemoryEntry {
     itemId:    string;
     timestamp: number;
     price:     number;
     volume:    number;
   }
   
   export type AscendancyPath = 'economicMastery' | 'ritualDominance' | 'secretQuest' | 'rumorWeaver' | string;
   export interface AscendancyStatus {
     path:     AscendancyPath;
     progress: number;
     unlocked: boolean;
   }
   
   /* ╭──────────────────────────╮
      │  Top-level Game State    │
      ╰──────────────────────────╯ */
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
     status:       GameStatus;
     actionsUsed:  number;
   }
   
   /* ╭──────────────────────────╮
      │  Rune-Crush Mini-Game    │
      ╰──────────────────────────╯ */
   export type Rune = 'EARTH' | 'WATER' | 'FIRE' | 'AIR' | 'AETHER' | 'CATALYST';
   
   export interface RecipeMeta {
     targetScore:  number;
     maxMoves:     number;
     optimalMoves: number;
   }
   export type Recipes = Record<string, RecipeMeta>;
   
   export interface Coord { x: number; y: number; }
   export interface BrewMove { from: Coord; to: Coord; }
   
   export interface BrewMatch3Result {
     recipeId: string;
     seed:     string;
     moves:    BrewMove[];
     quality:  number;     // 0‥1 (after server verification)
   }
   
   /* ╭──────────────────────────╮
      │   Front-end Game Actions │
      ╰──────────────────────────╯ */
   export type Action =
     | { type: 'plant';   crop: CropType; index: number }
     | { type: 'harvest'; index: number }
     | { type: 'water';   index: number }
     | { type: 'buy';     itemId: string; quantity: number }
     | { type: 'sell';    itemId: string; quantity: number }
     | { type: 'brew';    recipeId: string }
     | { type: 'fulfill'; requestId: string }
     | { type: 'noop' };   // convenience for initial reducer call
   
   /** Back-end alias (many server files import `GameAction`). */
   export type GameAction = Action;   