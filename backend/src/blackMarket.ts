// backend/src/blackMarket.ts

import { v4 as uuidv4 } from "uuid";
import { BlackMarketItem } from "./shared/types";

const itemId = uuidv4();

export function getBlackMarketItem(): Record<string, BlackMarketItem> {
  return {
    [itemId]: {
      type: "blackMarket",
      name: "Stolen petals",
      price: 50,
      stock: 2,
      riskLevel: 30,
      currentPrice: 50,
      rumors: [],
    },
  };
}