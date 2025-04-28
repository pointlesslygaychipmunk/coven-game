import { v4 as uuidv4 } from 'uuid';
import type { GameState, GardenSlot } from '../../shared/src/types'; // <-- fixed
import { getStartingFamiliarPowers } from './modules/familiarPowers';
import { generateTownRequests } from './generateTownRequests';

/** Helper: create an empty garden grid */
function makeStarterGarden(): GardenSlot[] {
  return Array.from({ length: 8 }, () => ({
    crop: null,
    growth: 0,
    kind: 'crop',
    dead: false,
    watered: false,
  }));
}

/** Corrected initial market items */
const initialMarketItems = {
  mushroom: { type: 'crop', price: 3, stock: 5 },
  flower: { type: 'crop', price: 2, stock: 6 },
  herb: { type: 'ingredient', price: 4, stock: 4 },
  fruit: { type: 'crop', price: 5, stock: 3 },
} as const;

export function createGameState(): GameState {
  const playerId = 'player1';

  return {
    players: [
      {
        id: playerId,
        name: 'Demo Witch',
        inventory: { mushroom: 3, flower: 0, herb: 0, fruit: 0 },
        potions: [],
        garden: makeStarterGarden(),
        gold: 100,
        mana: 10,
        renown: 0,
        craftPoints: 0,
        upgrades: { well: 0, cart: 0, cellar: 0, cauldron: 0 },
        wateringUsed: 0,
        journal: [],
        rumorsHeard: [],
        memory: [],
        familiarPowers: getStartingFamiliarPowers(),
        ascendancy: { path: '', progress: 0, unlocked: false },
        quests: [],
      },
    ],
    market: {
      items: Object.fromEntries(
        Object.entries(initialMarketItems).map(([id, item]) => [
          id,
          { ...item, currentPrice: item.price },
        ])
      ),
    },
    townRequests: generateTownRequests([], { year: 1, season: 'spring', moonPhase: 0, weather: 'sunny' }),
    quests: [],
    rumors: [],
    journal: [`Game start: Demo Witch enters the Coven.`],
    status: { year: 1, moonPhase: 0, season: 'spring', weather: 'sunny' },
    actionsUsed: 0,
    currentPlayer: 0,
  };
}

export default createGameState;
