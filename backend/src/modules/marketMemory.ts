// backend/src/modules/marketMemory.ts

import { Player, MarketState, GameStatus, MarketMemoryEntry } from '.././shared/types';

/**
 * Append a memory entry for the given item transaction.
 * Called from executeActions whenever a buy or sell happens.
 */
export function recordMemoryEntry(
  player: Player,
  market: MarketState,
  status: GameStatus,
  itemId: string,
  price: number,
  volume: number
): void {
  if (!player.memory) player.memory = [];

  const entry: MarketMemoryEntry = {
    itemId,
    // Use a simple timestamp; you can also combine with status.year if desired
    timestamp: Date.now(),
    price,
    volume,
  };

  player.memory.push(entry);
}