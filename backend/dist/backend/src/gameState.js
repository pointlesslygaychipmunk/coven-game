"use strict";
// backend/src/gameState.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialGameState = void 0;
// eight empty garden slots
const defaultGarden = Array(8).fill({
    type: "mushroom",
    kind: "crop",
    growth: 0,
    isDead: false,
});
exports.initialGameState = {
    players: [
        {
            id: 'player1',
            name: 'Apprentice',
            inventory: { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
            potions: [],
            gold: 0,
            mana: 0,
            renown: 0,
            craftPoints: 0,
            garden: defaultGarden,
            upgrades: { well: 0, cart: 0, cellar: 0, cauldron: 0 },
            wateringUsed: 0,
            // new fields
            journal: [],
            rumorsHeard: [],
            memory: [],
            familiarPowers: [],
            quests: [],
            ascendancy: { path: "", progress: 0, unlocked: false },
        },
    ],
    market: {
        items: {}, // will be populated via createGameState or server init
    },
    townRequests: [],
    quests: [],
    rumors: [],
    journal: [],
    status: {
        year: 1,
        moonPhase: 0,
        season: "spring",
        weather: "sunny",
    },
    actionsUsed: 0,
};
