import { Player, FamiliarPower } from '../../../shared/types';

/**
 * Retrieves a player's familiar powers.
 */
export function getFamiliarPowers(player: Player): FamiliarPower[] {
  return player.familiarPowers || [];
}
