// backend/src/gameState.ts

import { GameState, Player, GardenSlot, Potion, MarketItem } from '../../shared/types';

const defaultGarden: GardenSlot[] = [];

export const initialGameState: GameState = {
  players: [
    {
      id: 'player1',
      name: 'Apprentice',
      inventory: {
        mushroom: 0,
        flower: 0,
        herb: 0,
        fruit: 0,
        tree: 0,
      },
      potions: [],
      garden: defaultGarden,
      upgrades: [],
      gold: 50,
      renown: 0,
      alerts: [],
      mana: 0,
      wateringUsed: 0,
      craftPoints: 0,
    },
  ],
  market: {}, // ✅ Matches MarketState = Record<string, MarketItem>
  townRequests: [],
  status: {
    season: 'spring',
    weather: 'sunny',
    moonPhase: 0,
    year: 1,
  },
  journal: [],
  rumors: [], // ✅ REQUIRED FIELD ADDED
  actionsUsed: 0,
};