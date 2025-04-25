import { RitualQuestCard, GameState } from '../../../shared/types';

/**
 * Returns active (unfulfilled) quests.
 */
export function getActiveQuests(state: GameState): RitualQuestCard[] {
  return state.quests.filter(q => !q.fulfilled);
}
