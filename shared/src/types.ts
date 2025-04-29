// shared/src/types.ts
// Comprehensive types for the Coven game with full support for all systems

// ============= BASIC TYPES =============

// Item types in the game
export type ItemType = 'seed' | 'ingredient' | 'potion' | 'tool' | 'ritual_item';

// Item category for more granular classification
export type ItemCategory = 
  'herb' | 'flower' | 'mushroom' | 'fruit' | 'root' | 'leaf' | 
  'essence' | 'oil' | 'powder' | 'crystal' | 'clay' | 'water' | 
  'mask' | 'cream' | 'serum' | 'tonic' | 'elixir';

// Rarity of items
export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic';

// ============= TIME & ENVIRONMENT =============

// Seasons in the game
export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';

// Lunar phases
export type MoonPhase =
  'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous' |
  'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent';

// Weather conditions
export type WeatherFate = 'normal' | 'rainy' | 'dry' | 'foggy' | 'windy' | 'stormy';

// Time tracking interface
export interface GameTime {
  year: number;
  season: Season;
  phase: number; // Moon phase index (0-7)
  phaseName: MoonPhase;
  weatherFate: WeatherFate;
  previousWeatherFate?: WeatherFate; // For tracking changes
  dayCount: number; // Total days elapsed since game start
}

// ============= GARDEN & PLANTS =============

// Growth stages for plants
export interface Plant {
  name: string;
  category: ItemCategory;
  growth: number; // Current growth progress
  maxGrowth: number; // Required growth stages to mature
  watered: boolean; // Whether it has been watered this turn
  health: number; // 0-100, affects yield quality
  age: number; // Days since planting
  mature: boolean; // If the plant is ready to harvest
  moonBlessed?: boolean; // Special condition from planting during specific moon phase
  seasonalModifier?: number; // How well the plant grows in current season
  deathChance?: number; // Chance of dying if neglected
  qualityModifier?: number; // Affects the quality of harvested ingredients
  mutations?: string[]; // Special traits developed
}

// Garden plot data
export interface GardenSlot {
  id: number;
  plant: Plant | null;
  fertility: number; // 0-100, affects growth speed
  sunlight: number; // 0-100, some plants need more/less
  moisture: number; // 0-100, current moisture level
  soilType?: string; // Different soil types for different plants
  protected?: boolean; // Protection from harsh weather
  lastHarvested?: number; // Turn number of last harvest
}

// ============= ITEMS & INVENTORY =============

// Base item interface
export interface Item {
  id: string;
  name: string;
  type: ItemType;
  category: ItemCategory;
  description: string;
  rarity: Rarity;
  basePrice: number;
  moonPhaseBonus?: MoonPhase; // Moon phase where this item is more potent
  seasonalBonus?: Season; // Season where this item is more effective
  imagePath?: string; // For UI rendering
}

// Market item with dynamic pricing
export interface MarketItem extends Item {
  price: number; // Current market price (fluctuates)
  basePrice: number; // Standard price (for reference)
  quantity?: number; // Available quantity in market
  priceHistory?: number[]; // Track price changes over time
  volatility?: number; // How much the price fluctuates
  lastPriceChange?: number; // Turn number of last price change
  blackMarketOnly?: boolean; // If only available in black market
}

// Player inventory item
export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  type: ItemType;
  quantity: number;
  quality?: number; // 0-100, affects potency/value
  harvestedDuring?: MoonPhase; // When it was harvested (affects potency)
  harvestedSeason?: Season; // When it was harvested (affects properties)
}

// Recipe for crafting skincare products
export interface Recipe {
  id: string;
  name: string;
  ingredients: { itemName: string, quantity: number }[];
  result: string;
  resultQuantity: number;
  difficulty: number; // 1-10, affects success chance
  requiredSpecialization?: AtelierSpecialization; // Specialization needed
  moonPhaseBonus?: MoonPhase; // Best moon phase for brewing
  description: string;
  unlocked: boolean; // If the player has discovered this recipe
}

// ============= PLAYER & PROGRESSION =============

// Atelier specialization types
export type AtelierSpecialization = 'Essence' | 'Fermentation' | 'Distillation' | 'Infusion';

// Atelier specialization details
export interface AtelierSpec {
  id: string;
  name: string;
  description: string;
  startBonus: string;
  level: number;
  experience: number;
  abilities: string[];
  passive: string;
  masteryProgress: number; // 0-100
}

// Skills and progression
export interface Skills {
  gardening: number;
  brewing: number;
  trading: number;
  crafting: number;
  herbalism: number;
  astrology: number;
}

// Player data
export interface Player {
  id: string;
  name: string;
  gold: number;
  mana: number;
  reputation: number;
  atelierSpecialization: AtelierSpecialization;
  atelierLevel: number;
  skills: Skills;
  inventory: InventoryItem[];
  garden: GardenSlot[];
  knownRecipes: string[];
  completedRituals: string[];
  journalEntries: number[]; // References to entries the player has discovered
  questsCompleted: number;
  daysSurvived: number;
  blackMarketAccess: boolean;
  lastActive: number; // Last turn the player was active
}

// ============= QUESTS & EVENTS =============

// Town requests (simple quests)
export interface TownRequest {
  id: string;
  item: string;
  quantity: number;
  rewardGold: number;
  rewardInfluence: number;
  requester: string;
  deadline?: number; // Optional: turns until request expires
  description: string;
  difficulty: number; // 1-5 stars
  completed: boolean;
}

// Ritual quest (more complex multi-step quests)
export interface RitualQuest {
  id: string;
  name: string;
  description: string;
  stepsCompleted: number;
  totalSteps: number;
  steps: { description: string, completed: boolean }[];
  rewards: { type: 'gold' | 'item' | 'skill' | 'reputation', value: number | string }[];
  requiredMoonPhase?: MoonPhase;
  requiredSeason?: Season;
  deadline?: number; // Turn by which this must be completed
  unlocked: boolean;
}

// Rumor affecting the game world
export interface Rumor {
  id: string;
  content: string;
  spread: number; // How widely it has spread (0-100)
  affectedItem?: string; // Item affected by the rumor
  priceEffect?: number; // How much it affects price (multiplier)
  duration: number; // How many turns the rumor lasts
  verified: boolean; // If the rumor is true or false
  origin: string; // Who started the rumor
  turnsActive: number; // How long it's been active
}

// Journal entry for player's log
export interface JournalEntry {
  id: number;
  turn: number;
  date: string; // Human-readable date
  text: string;
  category: 'event' | 'discovery' | 'market' | 'ritual' | 'season' | 'moon';
  importance: number; // 1-5, affects display
  readByPlayer: boolean;
}

// Special event in the game world
export interface GameEvent {
  id: string;
  name: string;
  description: string;
  effects: string[];
  duration: number; // How many turns it lasts
  trigger: 'moon' | 'season' | 'random' | 'reputation';
  triggerValue: string | number; // Specific phase/season or threshold
  active: boolean;
}

// ============= ECONOMY & MARKET =============

// Market data for tracking economic conditions
export interface MarketData {
  inflation: number; // General price multiplier
  demand: { [itemName: string]: number }; // Demand for specific items (0-100)
  supply: { [itemName: string]: number }; // Supply of specific items (0-100)
  volatility: number; // General price volatility
  blackMarketAccessCost: number; // Cost to access black market
  blackMarketUnlocked: boolean; // If black market is accessible
  tradingVolume: number; // How much trading is happening
}

// ============= MAIN GAME STATE =============

// Complete game state
export interface GameState {
  players: Player[];
  market: MarketItem[];
  marketData: MarketData;
  townRequests: TownRequest[];
  rituals: RitualQuest[];
  rumors: Rumor[];
  journal: JournalEntry[];
  events: GameEvent[];
  currentPlayerIndex: number;
  time: GameTime;
  version: string; // Game version for compatibility
  lastSaved?: number; // Timestamp of last save
  seed?: number; // Random seed for deterministic generation
}

// ============= UTILITY TYPES =============

// Response from server actions
export interface GameResponse {
  success: boolean;
  message: string;
  state?: GameState;
  error?: string;
}

// Action types for logging and state management
export type GameAction = 
  'plant' | 'water' | 'harvest' | 'brew' | 
  'buy' | 'sell' | 'fulfill' | 'endTurn' | 
  'ritual' | 'startGame' | 'saveGame' | 'loadGame';

// Action log entry
export interface ActionLog {
  playerId: string;
  action: GameAction;
  timestamp: number;
  parameters: any; // Action-specific parameters
  result: boolean; // Success or failure
}