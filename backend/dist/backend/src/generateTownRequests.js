"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTownRequests = void 0;
const uuid_1 = require("uuid");
function generateTownRequests() {
    const ingredients = ["herb", "flower", "mushroom", "fruit"];
    const seasons = ["spring", "summer", "autumn", "winter"];
    return Array.from({ length: 3 }, (_, i) => {
        const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
        const randomSeason = seasons[Math.floor(Math.random() * seasons.length)];
        const potionNeeds = {
            herb: 0,
            flower: 0,
            mushroom: 0,
            fruit: 0,
        };
        potionNeeds[randomIngredient] = 1;
        const card = {
            id: (0, uuid_1.v4)(),
            description: `Deliver 1 ${randomIngredient} potion`,
            reward: { gold: 10 },
            boardSlot: (i % 3) + 1,
            potionNeeds,
            craftPoints: 1,
            fulfilled: false,
            season: randomSeason,
        };
        return card;
    });
}
exports.generateTownRequests = generateTownRequests;
