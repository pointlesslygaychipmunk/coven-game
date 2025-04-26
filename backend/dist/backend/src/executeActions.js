"use strict";
// backend/src/executeActions.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeActions = void 0;
const marketMemory_1 = require("./modules/marketMemory");
/** Type‐guard: is this ID a garden crop? */
function isCropType(id) {
    return ['mushroom', 'flower', 'herb', 'fruit'].includes(id);
}
/**
 * Execute a batch of actions for a single player.
 */
function executeActions(state, playerId, actions) {
    const player = state.players.find((p) => p.id === playerId);
    if (!player)
        throw new Error(`Player ${playerId} not found`);
    // Default empty ingredients for new potions
    const defaultIngredients = {
        mushroom: 0,
        flower: 0,
        herb: 0,
        fruit: 0,
    };
    for (const action of actions) {
        if (action.type === 'buy') {
            const { itemId, quantity } = action;
            const item = state.market.items[itemId];
            const price = item.currentPrice ?? item.price;
            // 1) Deduct cost
            player.gold -= price * quantity;
            // 2) Add to inventory or create potions
            if (isCropType(itemId)) {
                player.inventory[itemId] = (player.inventory[itemId] || 0) + quantity;
            }
            else if (item.type === 'potion') {
                for (let i = 0; i < quantity; i++) {
                    player.potions.push({
                        id: `${itemId}_${Date.now()}_${i}`,
                        name: item.name,
                        tier: item.tier,
                        ingredients: { ...defaultIngredients },
                    });
                }
            }
            // Black‐market buys are only logged to memory/rumors
            // 3) Update market stock
            item.stock = (item.stock || 0) - quantity;
            // 4) Record in memory
            (0, marketMemory_1.recordMemoryEntry)(player, state.market, state.status, itemId, price, quantity);
        }
        if (action.type === 'sell') {
            const { itemId, quantity } = action;
            const item = state.market.items[itemId];
            const price = item.currentPrice ?? item.price;
            // 1) Add revenue
            player.gold += price * quantity;
            // 2) Remove from inventory (only crops)
            if (isCropType(itemId)) {
                player.inventory[itemId] = (player.inventory[itemId] || 0) - quantity;
            }
            // 3) Update market stock
            item.stock = (item.stock || 0) + quantity;
            // 4) Record sale (negative volume)
            (0, marketMemory_1.recordMemoryEntry)(player, state.market, state.status, itemId, price, -quantity);
        }
        // Other action types (plant, harvest, fulfill) are no-ops here
    }
    return state;
}
exports.executeActions = executeActions;
