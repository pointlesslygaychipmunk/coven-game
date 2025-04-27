import { Player } from '../../../shared/src/types';

/**
 * Retrieves a player's ascendancy status.
 */
export function getAscendancyStatus(player: Player) {
  return player.ascendancy;
}
