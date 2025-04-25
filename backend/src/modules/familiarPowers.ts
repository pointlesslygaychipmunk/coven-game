import { FamiliarPower, Player, GameStatus } from '../../../shared/types';

/**
 * Generate available familiar powers for a player at game start.
 */
export function getInitialFamiliarPowers(): FamiliarPower[] {
  // TODO: Return a set of starting familiar powers
  return [];
}

/**
 * Apply familiar power effects at turn advance.
 */
export function applyFamiliarPowers(
  player: Player,
  status: GameStatus
): void {
  // TODO: Modify player or global state according to powers
}
