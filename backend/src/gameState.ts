import { GameState, Player, GardenSlot, MarketState } from '../../shared/types';

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
      },
      potions: [],
      garden: defaultGarden,
      upgrades: {
        well: 0,
        cart: 0,
        cellar: 0,
        cauldron: 0,
      },
      gold: 50,
      renown: 0,
      alerts: [],
      mana: 0,
      wateringUsed: 0,
      craftPoints: 0,
    },
  ],
  market: {
    items: {}, // ✅ FIXED: required by MarketState
  },
  townRequests: [],
  status: {
    season: 'spring',
    weather: 'sunny',
    moonPhase: 0,
    year: 1,
  },
  journal: [],
  rumors: [],
  actionsUsed: 0,
};