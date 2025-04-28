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
  MarketMemoryEntry
} from "@shared/types";

// Predefine a default empty garden (8 slots of dormant mushrooms)
const defaultGarden: GardenSlot[] = Array.from({ length: 8 }, () => ({
  crop: "mushroom",
  kind: "crop",
  growth: 0,
  dead: false,
  watered: false
}));

/** A pre-initialized GameState for quick starts or testing. */
export const initialGameState: GameState = {
  players: [
    {
      id: "player1",
      name: "Apprentice",
      inventory: { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
      potions: [],
      gold: 0,
      mana: 0,
      renown: 0,
      craftPoints: 0,
      garden: defaultGarden,
      upgrades: { well: 0, cart: 0, cellar: 0, cauldron: 0 },
      wateringUsed: 0,
      journal: [],
      rumorsHeard: [],
      memory: [] as MarketMemoryEntry[],
      familiarPowers: [] as FamiliarPower[],
      quests: [] as RitualQuestCard[],
      ascendancy: { path: "", progress: 0, unlocked: false }
    } as Player
  ],

  market: {
    items: {}
  } as MarketState,

  townRequests: [] as TownRequestCard[],
  quests: [] as RitualQuestCard[],
  rumors: [] as Rumor[],
  journal: [],
  status: { year: 1, moonPhase: 0, season: "spring", weather: "sunny" },
  actionsUsed: 0
};
