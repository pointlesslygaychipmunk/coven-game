// Shared types and interfaces for Coven game

// Basic type aliases
export type PlayerID = string;
export type ItemName = string;
export type TownName = string;
export type PotionName = string;

// Enumerations for certain categories
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
export type Weather = 'clear' | 'rainy' | 'stormy' | 'misty' | 'snowy';

export interface InventoryItem {
  name: ItemName;
  category: 'seed' | 'herb' | 'potion';
  quantity: number;
  tier?: number; // for potions, indicates potency tier (1 = base)
}

export interface GardenSlot {
  id: number;
  plant: {
    name: ItemName; // herb name that is growing
    growth: number; // current growth progress
    growthRequired: number; // required to mature
    watered: boolean; // if watered this turn
  } | null;
}

export interface MarketItem {
  name: ItemName;
  category: 'seed' | 'herb' | 'potion';
  basePrice: number;
  price: number;
  // Market memory: track demand or supply for dynamic pricing
  demandMemory: number; // positive if recently bought, negative if sold
  available?: number; // optional stock count, if limited (undefined => unlimited)
  blackMarket?: boolean; // if this item only appears in black market events
}

export interface TownRequest {
  id: string;
  town: TownName;
  item: ItemName;
  quantity: number;
  rewardGold: number;
  rewardInfluence: number;
  fulfilled: boolean;
}

export interface Rumor {
  id: string;
  content: string;
  spread: number; // how far it has spread (abstract value)
  impact?: string; // description of any effect the rumor has caused
}

export interface RitualQuest {
  name: string;
  steps: Array<{ description: string; requirement: { item: ItemName; quantity: number; }; done: boolean; }>;
  currentStep: number;
  active: boolean;
  // We track who completed it if done
  completedBy?: PlayerID;
}

export interface Player {
  id: PlayerID;
  name: string;
  gold: number;
  garden: GardenSlot[];
  inventory: InventoryItem[];
  influence: Record<TownName, number>;
  ascendancy: boolean; // whether this player achieved Hexcraft Ascendancy
  actionsUsed: number; // how many actions used in current turn
}

export interface GameStatus {
  turn: number;        // turn count (incremented each moon phase)
  moonPhase: number;   // current moon phase index (0-7, e.g., 0 = New Moon, 4 = Full Moon)
  season: Season;
  weather: Weather;
  currentPlayer: PlayerID;
  status: 'ongoing' | 'completed';
  winner?: PlayerID;
}

export interface GameState {
  players: Player[];
  market: MarketItem[];
  townRequests: TownRequest[];
  rumors: Rumor[];
  ritual: RitualQuest;
  log: string[]; // event log for journal
  status: GameStatus;
}

// Game actions definitions
export interface PlantAction {
  type: 'plant';
  playerId: PlayerID;
  seedName: ItemName;
  slotId: number;
}
export interface WaterAction {
  type: 'water';
  playerId: PlayerID;
  slotId: number;
}
export interface HarvestAction {
  type: 'harvest';
  playerId: PlayerID;
  slotId: number;
}
export interface BrewAction {
  type: 'brew';
  playerId: PlayerID;
  ingredients: ItemName[];
}
export interface BuyAction {
  type: 'buy';
  playerId: PlayerID;
  itemName: ItemName;
}
export interface SellAction {
  type: 'sell';
  playerId: PlayerID;
  itemName: ItemName;
}
export interface StartRumorAction {
  type: 'startRumor';
  playerId: PlayerID;
  content: string;
}
export interface FulfillRequestAction {
  type: 'fulfillRequest';
  playerId: PlayerID;
  requestId: string;
}
export interface PerformRitualStepAction {
  type: 'performRitual';
  playerId: PlayerID;
}
export interface EndTurnAction {
  type: 'endTurn';
  playerId: PlayerID;
}

export type GameAction = 
  | PlantAction
  | WaterAction
  | HarvestAction
  | BrewAction
  | BuyAction
  | SellAction
  | StartRumorAction
  | FulfillRequestAction
  | PerformRitualStepAction
  | EndTurnAction;
