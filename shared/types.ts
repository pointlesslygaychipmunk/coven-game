export type CropType = "mushroom" | "flower" | "herb";
export type PotionType = CropType | "fruit";

export interface CropSlot {
  kind: "crop";
  type: CropType;
  growth: number;
  isDead: boolean;
}

export interface TreeSlot {
  kind: "tree";
  growth: number;
  isDead: boolean;
}

export type GardenSlotObject = CropSlot | TreeSlot | null;

export interface Garden {
  spaces: GardenSlotObject[]; // Length 8
}

export interface Player {
  id: string;
  name: string;
  alerts?: string[];
  gold: number;
  renown: number;
  craftPoints: number;
  mana: number;
  inventory: Record<PotionType, number>;
  potions: Record<PotionType, number>;
  upgrades: {
    well: number;
    cellar: number;
    cart: number;
    cauldron: number;
  };
  garden: {
    spaces: GardenSlot[];
  };
}

export interface GameStatus {
  year: number;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  moonPhase: number;
  weather: 'Sunny' | 'Rainy' | 'Foggy' | 'Stormy' | 'Cloudy';
}

export interface TownRequestCard {
  id: string;
  potionNeeds: Record<"mushroom" | "flower" | "herb" | "fruit", number>;
  type: string;
  count: number;
  boardSlot: 1 | 2 | 3 | 4;
  craftPoints: number;
  reward: { gold: number; renown: number };
  fulfilled: boolean;
}

export interface GameState {
  player: Player;
  status: GameStatus;
  market: Record<'mushroom' | 'flower' | 'herb' | 'fruit', { price: number; stock: number }>;
  marketEvent: { name: string; description: string } | null;
  pendingActions: PlayerAction[];
  actionsUsed: number;
  townRequests: TownRequestCard[];
}

export type MarketState = Record<PotionType, {
  price: number;
  stock: number;
}>;

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
export type Weather = 'Sunny' | 'Rainy' | 'Foggy' | 'Stormy' | 'Cloudy';

export type GardenSlot = GardenSlotObject | null;

export interface ScoreData {
  total: number;
  breakdown: Record<string, number>;
  lost: boolean;
}

export type PlayerAction =
  | 'plant'
  | 'harvest'
  | 'brew'
  | 'buy'
  | 'sell'
  | 'upgrade'
  | 'fulfill'
  | 'forage'
  | 'fortune'
  | 'lady'
  | 'water';

  export const ACTION_LABELS: Record<PlayerAction, string> = {
    water: "💧 Water",
    plant: "🌱 Plant",
    harvest: "🌾 Harvest",
    brew: "🧪 Brew",
    buy: "🛒 Buy",
    sell: "💰 Sell",
    upgrade: "🛠️ Upgrade",
    fulfill: "📦 Fulfill Request",
    forage: "🌲 Forage",
    fortune: "🔮 Tell Fortune",
    lady: "🌕 Consult a Lady"
  };  