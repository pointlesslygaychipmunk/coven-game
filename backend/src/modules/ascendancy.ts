import { Player, GameState } from '../../../shared/types';

/**
 * Update a single player's ascendancy progress.
 * Returns an optional log entry to append to the journal.
 */
export function updateAscendancy(
  player: Player,
  state: GameState
): string | undefined {
  // TODO: Analyze player stats (renown, market mastery, quest completions)
  //       and update player.ascendancy
  return undefined;
}
