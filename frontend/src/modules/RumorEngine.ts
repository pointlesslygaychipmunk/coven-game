import { GameState, Rumor } from '../../../shared/types';

/**
 * Extracts the full rumor feed from the game state.
 */
export function getRumorFeed(state: GameState): Rumor[] {
  return state.rumors;
}
