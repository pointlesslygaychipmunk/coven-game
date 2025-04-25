// backend/src/gameState.ts

import {
  GameState,
  Player,
  GardenSlot,
  MarketState,
  TownRequestCard,
  RitualQuestCard,
  Rumor,
  FamiliarPower,
  AscendancyStatus,
  MarketMemoryEntry,
} from '../../shared/types';

// eight empty garden slots
const defaultGarden: GardenSlot[] = Array(8).fill({
  type:      "mushroom",  // placeholder until planted
  kind:      "crop",
  growth:    0,
  isDead:    false,
});

export const initialGameState: GameState = {
  players: [
    {
      id:            'player1',
      name:          'Apprentice',
      inventory:     { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
      potions:       [],
      gold:          0,
      mana:          0,
      renown:        0,
      craftPoints:   0,
      garden:        defaultGarden,
      upgrades:      { well: 0, cart: 0, cellar: 0, cauldron: 0 },
      wateringUsed:  0,

      // new fields
      journal:         [],
      rumorsHeard:     [],
      memory:          [],
      familiarPowers:  [] as FamiliarPower[],
      quests:          [] as RitualQuestCard[],
      ascendancy:      { path: "", progress: 0, unlocked: false },
    } as Player,
  ],

  market: {
    items: {},   // will be populated via createGameState or server init
  } as MarketState,

  townRequests: [] as TownRequestCard[],
  quests:       [] as RitualQuestCard[],
  rumors:       [] as Rumor[],
  journal:      [],

  status: {
    year:      1,
    moonPhase: 0,
    season:    "spring",
    weather:   "sunny",
  },

  actionsUsed: 0,
};