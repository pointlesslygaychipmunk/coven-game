import { Player, MarketState, GameStatus, MarketMemoryEntry } from "@shared/types";

/**
 * Append a memory entry for an item transaction (buy or sell) to the player's memory log.
 */
export function recordMemoryEntry(
  player: Player,
  market: MarketState,
  status: GameStatus,
  itemId: string,
  price: number,
  volume: number
): void {
  if (!player.memory) {
    player.memory = [];
  }
  const entry: MarketMemoryEntry = {
    itemId,
    timestamp: Date.now(),  // using current time; could incorporate status.year if needed
    price,
    volume
  };
  player.memory.push(entry);
}
