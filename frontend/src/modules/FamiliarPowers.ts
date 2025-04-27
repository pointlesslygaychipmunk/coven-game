import { Player, FamiliarPower } from '../../../shared/src/types';

/**
 * Retrieves a player's familiar powers.
 */
export function getFamiliarPowers(player: Player): FamiliarPower[] {
  return player.familiarPowers || [];
}
