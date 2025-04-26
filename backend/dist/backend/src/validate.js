"use strict";
// backend/src/validate.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGameState = exports.validateRumor = exports.validateBlackMarketBuy = exports.validateFulfill = exports.validateBrew = exports.validateSell = exports.validateBuy = exports.validateHarvest = exports.validatePlant = exports.validateWater = void 0;
const potions_1 = require("./potions");
/**
 * Validate if the player can use the watering action.
 */
function validateWater(player) {
    return player.wateringUsed < 3;
}
exports.validateWater = validateWater;
/**
 * Validate if the player can plant a given crop.
 */
function validatePlant(player, slotIndex, slot) {
    // must have the crop in inventory
    return slot !== null && player.inventory[slot] > 0;
}
exports.validatePlant = validatePlant;
/**
 * Validate if the player can harvest at the given garden slot.
 */
function validateHarvest(player, slotIndex) {
    const slot = player.garden[slotIndex];
    return !!slot && slot.growth >= (slot.kind === 'tree' ? 3 : 1);
}
exports.validateHarvest = validateHarvest;
/**
 * Validate if the player can buy a given item from the market.
 */
function validateBuy(player, market, itemId, quantity = 1) {
    const item = market.items[itemId];
    if (!item)
        return false;
    const price = item.currentPrice ?? item.price;
    return item.stock >= quantity && player.gold >= price * quantity;
}
exports.validateBuy = validateBuy;
/**
 * Validate if the player can sell a given item back to the market.
 */
function validateSell(player, market, itemId, quantity = 1) {
    // selling crops/ingredients
    if (player.inventory[itemId] >= quantity)
        return true;
    // selling potions
    const count = player.potions.filter(p => p.name === itemId).length;
    return count >= quantity;
}
exports.validateSell = validateSell;
/**
 * Validate if the player can brew a given potion.
 */
function validateBrew(player, potionName) {
    const recipe = (0, potions_1.getPotionByName)(potionName);
    if (!recipe)
        return false;
    // check ingredients
    for (const [crop, needed] of Object.entries(recipe.ingredients)) {
        if (player.inventory[crop] < needed)
            return false;
    }
    return true;
}
exports.validateBrew = validateBrew;
/**
 * Validate if the player can fulfill a ritual quest.
 */
function validateFulfill(player, quest, contribution) {
    // ensure quest not already fulfilled
    if (quest.fulfilled)
        return false;
    // ensure player has enough craft points
    return player.craftPoints >= contribution;
}
exports.validateFulfill = validateFulfill;
/**
 * Validate black-market purchase (risk check).
 */
function validateBlackMarketBuy(player, item, quantity = 1) {
    if (item.type !== 'blackMarket')
        return false;
    const price = item.currentPrice ?? item.price;
    // simple risk threshold: player must have renown above riskLevel
    return player.gold >= price * quantity && player.renown >= item.riskLevel;
}
exports.validateBlackMarketBuy = validateBlackMarketBuy;
/**
 * Validate a rumor action (e.g., sharing or acting on a rumor).
 * Here we just check that the player hasn't already heard it.
 */
function validateRumor(player, rumorId) {
    return !player.rumorsHeard?.includes(rumorId);
}
exports.validateRumor = validateRumor;
/**
 * Validate game state before accepting a batch of actions.
 */
function validateGameState(state) {
    // Basic sanity: at least one player, market initialized
    return (state.players.length > 0 &&
        state.status.year > 0 &&
        Boolean(state.market?.items));
}
exports.validateGameState = validateGameState;
