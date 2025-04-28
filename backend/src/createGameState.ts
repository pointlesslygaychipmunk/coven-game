import type { GameState, GardenSlot } from "@shared/types";

/** Helper to create a fresh 8-slot starter garden (all slots empty crops). */
export function makeStarterGarden(): GardenSlot[] {
  return Array.from({ length: 8 }, (): GardenSlot => ({
    crop   : "mushroom",
    kind   : "crop",
    growth : 0,
    dead   : false,
    watered: false
  }));
}

/** Factory to create an initial GameState (used at server start or for new game). */
export function createGameState(): GameState {
  return {
    players: [
      {
        id: "player1",
        name: "Demo Witch",

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
        familiarPowers: [],
        ascendancy: { path: "", progress: 0, unlocked: false },
        quests: []
      }
    ],

    market: { items: {} },
    townRequests: [],
    quests: [],
    rumors: [],
    journal: [],
    status: { year: 1, moonPhase: 0, season: "spring", weather: "sunny" },
    actionsUsed: 0
  };
}

export default createGameState;
