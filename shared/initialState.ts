import type { Player, GameStatus, TownRequestCard } from "./types";

export const initialPlayerState: Player = {
  id: "player-1",
  name: "Witch Hazel",
  gold: 10,
  renown: 3,
  craftPoints: 0,
  mana: 3,
  garden: {
    spaces: [null, null, null, null, null, null, null, null],
  },
  inventory: {
    mushroom: 2,
    flower: 2,
    herb: 2,
    fruit: 2,
  },
  upgrades: {
    well: 0,
    cellar: 0,
    cart: 0,
    cauldron: 0,
  },
  potions: {
    mushroom: 0,
    flower: 0,
    herb: 0,
    fruit: 0,
  },
};

export const initialMarketState: Record<'mushroom' | 'flower' | 'herb' | 'fruit', { price: number; stock: number }> = {
  mushroom: { price: 3, stock: 5 },
  flower: { price: 2, stock: 6 },
  herb: { price: 4, stock: 4 },
  fruit: { price: 5, stock: 3 },
};

export const initialGameStatus: GameStatus = {
  moonPhase: 1,
  season: "Spring",
  weather: "Sunny",
  year: 1,
};