"use strict";
// src/initialState.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialGameStatus = exports.initialMarketState = exports.initialPlayerState = void 0;
// 8 empty garden slots (defaulting to a dormant mushroom)
function makeEmptyGarden() {
    return Array.from({ length: 8 }, () => ({
        type: "mushroom",
        kind: "crop",
        growth: 0,
    }));
}
exports.initialPlayerState = {
    id: "player-1",
    name: "Witch Hazel",
    inventory: { mushroom: 2, flower: 2, herb: 2, fruit: 2 },
    potions: [],
    gold: 10,
    mana: 3,
    renown: 3,
    craftPoints: 0,
    garden: makeEmptyGarden(),
    upgrades: { well: 0, cellar: 0, cart: 0, cauldron: 0 },
    wateringUsed: 0,
    journal: [],
    rumorsHeard: [],
    memory: [],
    familiarPowers: [],
    ascendancy: { path: "", progress: 0, unlocked: false },
    quests: [],
};
exports.initialMarketState = {
    items: {
        mushroom: { type: "crop", price: 3, stock: 5 },
        flower: { type: "crop", price: 2, stock: 6 },
        herb: { type: "ingredient", price: 4, stock: 4 },
        fruit: { type: "crop", price: 5, stock: 3 },
    },
};
exports.initialGameStatus = {
    year: 1,
    moonPhase: 1,
    season: "spring",
    weather: "sunny",
};
