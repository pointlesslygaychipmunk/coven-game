import { Player, MarketMemoryEntry } from '../../../shared/types';

/**
 * Retrieves a player's market memory entries.
 */
export function getMarketMemory(player: Player): MarketMemoryEntry[] {
  return player.memory || [];
}
