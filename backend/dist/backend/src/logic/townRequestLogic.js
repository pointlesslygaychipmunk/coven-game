"use strict";
// backend/src/logic/townRequestLogic.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTownRequests = void 0;
const uuid_1 = require("uuid");
/**
 * Maintain up to 3 active town requests.
 * Remove fulfilled, then generate new ones tied to current season.
 */
function generateTownRequests(existing, status) {
    // Keep only unfulfilled
    const active = existing.filter((r) => !r.fulfilled);
    // Fill to three cards
    while (active.length < 3) {
        const ingredients = [
            "herb",
            "flower",
            "mushroom",
            "fruit",
        ];
        const choice = ingredients[Math.floor(Math.random() * ingredients.length)];
        const card = {
            id: (0, uuid_1.v4)(),
            potionNeeds: {
                herb: 0,
                flower: 0,
                mushroom: 0,
                fruit: 0,
                [choice]: 1,
            },
            craftPoints: 1,
            boardSlot: ((active.length % 4) + 1),
            fulfilled: false,
            description: `Deliver 1 ${choice} potion`,
            reward: { gold: 10, renown: 1, craftPoints: 0 },
            season: status.season,
        };
        active.push(card);
    }
    return active;
}
exports.generateTownRequests = generateTownRequests;
