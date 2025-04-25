// backend/marketTypes.ts

import type { PotionTier, PotionIngredient } from "../shared/types";

export interface MarketMemory {
  bought: number;
  sold: number;
}

export interface MarketRumor {
  id: string;
  text: string;
  type: "positive" | "negative";
  targetId: string;
  impact: number;
}

export interface MarketItem {
  id: string;
  type: "potion" | "crop";
  label: string;
  tier: PotionTier;
  ingredients?: PotionIngredient[];
  basePrice: number;
  price: number;
  currentPrice: number;
  stock: number;
  volatility: number;
  memory: MarketMemory;
  sentiment: number;
  rumors: MarketRumor[];
}
