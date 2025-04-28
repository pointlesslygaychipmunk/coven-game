export type PlayerID = string;
export type ItemName = string;
export type TownName = string;
export type PotionName = string;

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
export type Weather = 'clear' | 'rainy' | 'stormy' | 'misty' | 'snowy';

export interface InventoryItem {
  name: ItemName;
  category: 'seed' | 'herb' | 'potion';
  quantity: number;
  tier?: number;
}

export interface GardenSlot {
  id: number;
  plant: {
    name: ItemName;
    growth: number;
    growthRequired: number;
    watered: boolean;
  } | null;
}

export interface MarketItem {
  name: ItemName;
  category: 'seed' | 'herb' | 'potion';
  basePrice: number;
  price: number;
  demandMemory: number;
  available?: number;
  blackMarket?: boolean;
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
  spread: number;
  impact?: string;
}

export interface RitualQuest {
  name: string;
  steps: Array<{
    description: string;
    requirement: { item: ItemName; quantity: number };
    done: boolean;
  }>;
  currentStep: number;
  active: boolean;
  completedBy?: PlayerID;
}

export interface Player {
  id: PlayerID;
  name: string;
  gold: number;
  garden: GardenSlot[];
  inventory: InventoryItem[];
  influence: Record<TownName, number>;
  ascendancy: boolean;
  actionsUsed: number;
}

export interface GameStatus {
  turn: number;
  moonPhase: number;
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
  log: string[];
  status: GameStatus;
}

// Actions
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
