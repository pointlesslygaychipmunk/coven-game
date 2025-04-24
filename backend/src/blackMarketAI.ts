import type { MarketState, PotionType } from "../../shared/types";

const possibleOffers: PotionType[] = ["mushroom", "flower", "herb", "fruit"];

export function generateBlackMarket(): MarketState {
  const market: MarketState = {} as MarketState;

  for (const type of possibleOffers) {
    const rare = Math.random() < 0.2;
    const price = rare ? 1 : Math.floor(Math.random() * 3) + 1;
    const stock = Math.floor(Math.random() * 2) + 1;

    market[type] = {
      price,
      stock
    };
  }

  return market;
}