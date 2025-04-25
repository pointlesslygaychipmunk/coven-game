// shared/actionTypes.ts

import type { CropType, PotionIngredient, PotionTier } from "./types";

// --- Strongly Typed Action Payloads ---

export interface PlantAction {
  type: "plant";
  payload: {
    crop: CropType;
  };
}

export interface HarvestAction {
  type: "harvest";
  payload: {
    crop: CropType;
  };
}

export interface WaterAction {
  type: "water";
  payload?: undefined; // no payload needed
}

export interface BrewAction {
  type: "brew";
  payload: {
    name: string;
    tier: PotionTier;
    ingredients: Record<PotionIngredient, number>;
  };
}

export interface SellAction {
  type: "sell";
  payload: {
    potionName: string;
    goldEarned: number;
  };
}

// --- Union of All Action Types ---

export type Action =
  | PlantAction
  | HarvestAction
  | WaterAction
  | BrewAction
  | SellAction;