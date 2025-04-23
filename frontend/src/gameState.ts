import type { Player, GameStatus, TownRequestCard, PotionType } from "../../shared/types";

// Initial player object
export const initialPlayerState: Player = {
  id: "player1",
  name: "Ava the Groveborn",
  gold: 10,
  renown: 0,
  craftPoints: 0,
  mana: 3,
  inventory: {
    mushroom: 2,
    flower: 2,
    herb: 2,
    fruit: 2,
  },
  potions: {
    mushroom: 0,
    flower: 0,
    herb: 0,
    fruit: 0,
  },
  upgrades: {
    well: 0,
    cellar: 0,
    cart: 0,
    cauldron: 0,
  },
  garden: {
    spaces: Array(8).fill(null),
  },
};

// Initial market state
export const initialMarketState: Record<PotionType, { price: number; stock: number }> = {
  mushroom: { price: 3, stock: 5 },
  flower: { price: 2, stock: 6 },
  herb: { price: 4, stock: 4 },
  fruit: { price: 5, stock: 3 },
};

// Initial game status
export const initialGameStatus: GameStatus = {
  year: 1,
  season: "Spring",
  moonPhase: 0,
  weather: "Sunny",
};

// Full initial game state object
export const initialGameState = {
  player: initialPlayerState,
  market: initialMarketState,
  status: initialGameStatus,
  townRequests: [] as TownRequestCard[],
};