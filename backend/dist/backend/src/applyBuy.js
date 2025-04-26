"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyBuy = void 0;
function applyBuy(state, playerId, item) {
    const player = state.players.find((p) => p.id === playerId);
    if (!player)
        throw new Error(`Player with ID ${playerId} not found`);
    const inventoryKey = item.type === "potion" ? item.name : item.type;
    if (item.type === "ingredient" || item.type === "crop") {
        const key = inventoryKey;
        player.inventory[key] = (player.inventory[key] ?? 0) + 1;
    }
    player.gold -= item.currentPrice ?? item.price;
    return state;
}
exports.applyBuy = applyBuy;
