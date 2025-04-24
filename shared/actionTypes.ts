import type { PotionType } from "../shared/types";

// 🌱 Planting a crop (non-fruit)
export type PlantAction = {
  type: "plant";
  crop: Exclude<PotionType, "fruit">;
  index: number; // plot index
};

// 🌳 Planting a tree
export type PlantTreeAction = {
  type: "plant-tree";
  index: number;
};

// 🪓 Felling a tree
export type FellTreeAction = {
  type: "fell-tree";
  index: number;
};

// 🌾 Harvesting (global, no index needed)
export type HarvestAction = {
  type: "harvest";
};

// 💧 Watering a plot
export type WaterAction = {
  type: "water";
  index: number;
};

// 🧪 Brewing a potion
export type BrewAction = {
    type: "brew";
    potion: PotionType;
  };  

// 🛒 Buying an item (ingredient)
export type BuyAction = {
  type: "buy";
  item: PotionType;
  quantity?: number;
};

// 💰 Selling an item
export type SellAction = {
  type: "sell";
  item: PotionType;
  quantity?: number;
};

// 🛠️ Upgrading a station
export type UpgradeAction = {
  type: "upgrade";
  upgraded: "well" | "cellar" | "cart" | "cauldron";
};

// 📦 Fulfilling a town request
export type FulfillAction = {
  type: "fulfill";
  requestId: string;
};

// 🌲 Foraging (future use)
export type ForageAction = {
  type: "forage";
};

// 🔮 Fortune-telling
export type FortuneAction = {
  type: "fortune";
};

// 🌕 Lady consultation
export type LadyAction = {
  type: "lady";
};

// ⏭️ Advancing to next moon phase
export type AdvanceAction = {
  type: "advance";
};

export type Action =
  | PlantAction
  | PlantTreeAction
  | FellTreeAction
  | HarvestAction
  | WaterAction
  | BrewAction
  | BuyAction
  | SellAction
  | UpgradeAction
  | FulfillAction
  | ForageAction
  | FortuneAction
  | LadyAction
  | AdvanceAction;