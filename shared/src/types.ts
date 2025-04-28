/* ──────────────────────────────────────────────────────────────
   Canonical shared game-types – single source of truth
   ──────────────────────────────────────────────────────────── */

   export type Season    = 'spring' | 'summer' | 'autumn' | 'winter';
   export type Weather   = 'sunny'  | 'rainy'  | 'stormy' | 'foggy'  | 'cloudy';
   export type MoonPhase = number;              // 0 … 7
   
   /* ════════════════  GARDEN  ════════════════ */
   
   export type CropType = 'mushroom' | 'flower' | 'herb' | 'fruit';
   
   /** One logical square in the garden grid */
   export interface GardenSlot {
     /** crop currently growing – `null` ⇒ empty / tilled soil              */
     crop : CropType | null;
     /** 0 – 1 fractional progress toward harvest-ready ( > 1 ⇢ fully grown) */
     growth : number;
     /** set by game-logic when crop dies                                    */
     dead?  : boolean;
     /** whether the player watered the slot this turn                       */
     watered?: boolean;
   }
   
   /** React components use the shorter alias `Tile` */
   export type Tile = GardenSlot;
   
   /* ════════════════  ECONOMY  ════════════════ */
   
   export type PotionTier = 'common' | 'uncommon' | 'rare' | 'legendary';
   export type PotionIngredient = CropType;
   
   export interface Potion {
     id         : string;
     name       : string;
     tier       : PotionTier;
     ingredients: Record<CropType, number>;
   }
   
   /* ════════════════  MARKET & RUMOURS  ════════════════ */
   
   export interface Rumor {
     id        : string;
     message   : string;
     source    : 'market' | 'town' | 'blackMarket' | 'quest';
     timestamp : number;
     effect?   : unknown;
   }
   export type MarketRumor = Pick<Rumor,'id'|'message'>;
   
   /* ════════════════  PLAYER & GAME-STATE  ════════════════ */
   
   export interface Player {
     id       : string;
     name     : string;
     inventory: Record<CropType, number>;
     potions  : Potion[];
     garden   : GardenSlot[];
     gold     : number;
     mana     : number;
     renown   : number;
   }
   
   export interface GameStatus {
     year     : number;
     moonPhase: MoonPhase;
     season   : Season;
     weather  : Weather;
   }
   
   export interface GameState {
     players     : Player[];
     status      : GameStatus;
     /** running turn-journal (used by several back-end modules) */
     journal     : string[];
     /** global rumours pool                                   */
     rumors      : Rumor[];
   }
   
   /* ════════════════  REDUCER ACTIONS  ════════════════ */
   
   export type Action =
     | { type:'plant'   ; crop:CropType ; index:number }
     | { type:'harvest' ; index:number }
     | { type:'water'   ; index:number }
     | { type:'buy'     ; itemId:string ; quantity:number }
     | { type:'sell'    ; itemId:string ; quantity:number }
     | { type:'brew'    ; recipeId:string }
     | { type:'fulfill' ; requestId:string };
   
   /** alias retained for legacy back-end code */
   export type GameAction = Action;
   
   /* ════════════════  RUNE-CRUSH BREWING  ════════════════ */
   
   export type Rune = 'EARTH' | 'WATER' | 'FIRE' | 'AIR' | 'AETHER' | 'CATALYST';
   
   export interface RecipeMeta {
     targetScore : number;
     maxMoves    : number;
     optimalMoves: number;
   }
   export type Recipes = Record<string,RecipeMeta>;
   
   export interface Coord { x:number; y:number }
   export interface BrewMove { from:Coord; to:Coord }
   
   export interface BrewMatch3Result {
     recipeId : string;
     seed     : string;
     moves    : BrewMove[];
     /** server-validated quality 0-1 */
     quality  : number;
   }   