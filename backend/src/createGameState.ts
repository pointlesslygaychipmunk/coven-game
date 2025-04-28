import type { GameState, GardenSlot } from "../../shared/src/types";

/* helper: make a fresh 8-slot garden row */
function newGarden(): GardenSlot[] {
  return Array.from({ length: 8 }, (): GardenSlot => ({
    crop   : "mushroom",    // initial tutorial seed
    kind   : "crop",
    growth : 0,
    dead   : false,
    watered: false,
  }));
}

export default function createGameState(): GameState {
  return {
    players: [{
      id:  "player1",
      name:"Demo Witch",

      inventory: { mushroom: 3, flower: 0, herb: 0, fruit: 0 },
      potions  : [],
      garden   : newGarden(),

      gold: 100,
      mana: 10,
      renown: 0,
      craftPoints: 0,
      upgrades:    { well:0, cart:0, cellar:0, cauldron:0 },
      wateringUsed:0,

      journal: [],
      rumorsHeard: [],
      memory: [],
      familiarPowers: [],
      ascendancy: { path:"", progress:0, unlocked:false },
      quests: [],
    }],

    market: { items: {} },
    townRequests: [],
    quests: [],
    rumors: [],
    journal: [],
    status: { year:1, moonPhase:0, season:"spring", weather:"sunny" },
    actionsUsed: 0,
  };
}