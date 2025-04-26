"use strict";
// backend/src/createGameState.ts
// ──────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGameState = void 0;
const uuid_1 = require("uuid");
// 1) Build an empty garden of 8 slots
function createEmptyGarden() {
    return Array.from({ length: 8 }, () => ({
        type: "mushroom",
        kind: "crop",
        growth: 0,
    }));
}
// 2) Bootstrap the first Market
function createInitialMarket() {
    return {
        items: {
            mushroom: { type: "crop", price: 5, stock: 20, basePrice: 5, volatility: 0.1 },
            flower: { type: "crop", price: 8, stock: 15, basePrice: 8, volatility: 0.1 },
            herb: { type: "ingredient", price: 12, stock: 10, basePrice: 12, volatility: 0.15 },
            // add more as needed…
        },
    };
}
function createGameState() {
    // --- player seed ---
    const player = {
        id: (0, uuid_1.v4)(),
        name: "Player 1",
        inventory: { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
        potions: [],
        gold: 0,
        mana: 0,
        renown: 0,
        craftPoints: 0,
        garden: createEmptyGarden(),
        upgrades: { well: 0, cart: 0, cellar: 0, cauldron: 0 },
        wateringUsed: 0,
        // optional fields initialized empty
        journal: [],
        rumorsHeard: [],
        memory: [],
        familiarPowers: [],
        ascendancy: { path: "", progress: 0, unlocked: false },
        quests: [],
    };
    // --- global status ---
    const status = {
        year: 1,
        moonPhase: 0,
        season: "spring",
        weather: "sunny",
    };
    // --- assemble full state ---
    return {
        players: [player],
        market: createInitialMarket(),
        townRequests: [],
        quests: [],
        rumors: [],
        journal: [],
        status,
        actionsUsed: 0,
    };
}
exports.createGameState = createGameState;
