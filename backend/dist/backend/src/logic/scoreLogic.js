"use strict";
// backend/src/logic/scoreLogic.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateScore = void 0;
/**
 * Compute the player's score.
 * - gold is worth 1 pt each
 * - renown is worth 5 pts each
 * - craftPoints are worth 3 pts each
 * - each potion owned is worth 2 pts
 * - each item in inventory is worth 1 pt
 * Adjust weights as you like!
 */
function calculateScore(state) {
    const player = state.players[0];
    const gold = player.gold;
    const renown = player.renown;
    const craftPoints = player.craftPoints;
    const potionCount = player.potions.length;
    // Sum up all raw inventory items (mushroom, flower, herb, fruit)
    const inventoryValue = Object.values(player.inventory)
        .reduce((sum, count) => sum + count, 0);
    // Apply weights
    const total = gold * 1 +
        renown * 5 +
        craftPoints * 3 +
        potionCount * 2 +
        inventoryValue * 1;
    // Example lose condition: no gold and no inventory
    const lost = gold === 0 && inventoryValue === 0 && potionCount === 0;
    return {
        total,
        breakdown: { gold, renown, craftPoints, potionCount, inventoryValue },
        lost,
    };
}
exports.calculateScore = calculateScore;
