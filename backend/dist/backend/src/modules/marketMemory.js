"use strict";
// backend/src/modules/marketMemory.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordMemoryEntry = void 0;
/**
 * Append a memory entry for the given item transaction.
 * Called from executeActions whenever a buy or sell happens.
 */
function recordMemoryEntry(player, market, status, itemId, price, volume) {
    if (!player.memory)
        player.memory = [];
    const entry = {
        itemId,
        // Use a simple timestamp; you can also combine with status.year if desired
        timestamp: Date.now(),
        price,
        volume,
    };
    player.memory.push(entry);
}
exports.recordMemoryEntry = recordMemoryEntry;
