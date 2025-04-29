// frontend/src/types.ts
// (Optional) Redefine shared interfaces for convenience, or import from shared if set up properly.

export type ItemType = 'seed' | 'ingredient' | 'potion';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemType;
  quantity: number;
}

export interface GardenSlot {
  id: number;
  plant: Plant | null;
}

export interface Plant {
  name: string;
  growth: number;
  maxGrowth: number;
  watered: boolean;
}

export interface MarketItem {
  id: string;
  name: string;
  type: ItemType;
  price: number;
  basePrice: number;
}

export interface TownRequest {
  id: string;
  item: string;
  quantity: number;
  rewardGold: number;
  rewardInfluence: number;
}

export interface RitualQuest {
  id: string;
  name: string;
  stepsCompleted: number;
  totalSteps: number;
}

export interface Rumor {
  id: string;
  content: string;
  spread: number;
}

export type WeatherFate = 'normal' | 'rainy' | 'dry';
export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';
export type MoonPhase = 
    'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous' |
    'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent';
export type AtelierSpecialization = 'Essence' | 'Fermentation' | 'Distillation' | 'Infusion';

export interface Player {
  id: string;
  name: string;
  gold: number;
  mana: number;
  reputation: number;
  atelierSpecialization: AtelierSpecialization;
  inventory: InventoryItem[];
  garden: GardenSlot[];
}

export interface GameState {
  players: Player[];
  market: MarketItem[];
  townRequests: TownRequest[];
  rituals: RitualQuest[];
  rumors: Rumor[];
  journal: { turn: number; text: string }[];
  currentPlayerIndex: number;
  time: {
    year: number;
    season: Season;
    phase: number;
    phaseName: MoonPhase;
    weatherFate: WeatherFate;
  };
}
