import type { PotionType, PlayerAction } from "../shared/types";

export type PlantAction = {
  type: "plant";
  crop: Exclude<PotionType, "fruit">;
  index: number;
};

export type PlantTreeAction = {
  type: "plant-tree";
  index: number;
};

export type FellTreeAction = {
  type: "fell-tree";
  index: number;
};

export type HarvestAction = {
  type: "harvest";
};

export type WaterAction = {
  type: "water";
};

export type BrewAction = {
  type: "brew";
  potion: PotionType;
};

export type BuyAction = {
  type: "buy";
  item: PotionType;
  quantity?: number;
};

export type SellAction = {
  type: "sell";
  item: PotionType;
  quantity?: number;
};

export type UpgradeAction = {
  type: "upgrade";
  upgraded: "well" | "cellar" | "cart" | "cauldron";
};

export type FulfillAction = {
  type: "fulfill";
  requestId: string;
};

export type ForageAction = {
  type: "forage";
};

export type FortuneAction = {
  type: "fortune";
};

export type LadyAction = {
  type: "lady";
};

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