import { Player, MarketState, GameStatus, MarketMemoryEntry } from '../../../shared/types';

/**
 * Record a player's interaction with the market.
 * Appends a memory entry with itemId, timestamp, price, and volume.
 */
export function recordMemoryEntry(
  player: Player,
  market: MarketState,
  status: GameStatus,
  volume: number = 1
): void {
  if (!player.memory) player.memory = [];
  // Example: pick a random market item to record
  const itemId = Object.keys(market.items)[0];
  const item = market.items[itemId];
  const price = item.currentPrice ?? item.price;
  player.memory.push({
    itemId,
    timestamp: Date.now(),
    price,
    volume,
  });
}
