import { v4 as uuidv4 } from "uuid";
import { MarketItem } from "../../shared/types";

export const blackMarketInventory: MarketItem[] = [
  {
    id: uuidv4(),
    type: "ingredient",
    label: "Nightshade",
    basePrice: 7,
    currentPrice: 7,
    price: 7,
    stock: 2,
    memory: [],
    sentiment: [],
    volatility: 0.4,
    rumors: []
  },
  {
    id: uuidv4(),
    type: "ingredient",
    label: "Mandrake",
    basePrice: 10,
    currentPrice: 10,
    price: 10,
    stock: 1,
    memory: [],
    sentiment: [],
    volatility: 0.5,
    rumors: []
  }
];