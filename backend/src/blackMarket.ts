import { BlackMarketItem } from "@shared/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Generate a new Black Market item listing with a unique ID.
 */
export function getBlackMarketItem(): Record<string, BlackMarketItem> {
  const itemId = uuidv4();
  return {
    [itemId]: {
      type: "blackMarket",
      name: "Suspicious Artifact",
      riskLevel: Math.floor(Math.random() * 5) + 1,  // example risk level 1-5
      price: 100,
      stock: 1
    }
  };
}
