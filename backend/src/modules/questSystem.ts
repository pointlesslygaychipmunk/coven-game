import { RitualQuestCard, GameState } from '../../../shared/types';

/**
 * Resolve ritual quests: mark fulfilled quests and distribute rewards.
 */
export function resolveQuests(
  quests: RitualQuestCard[],
  state: GameState
): RitualQuestCard[] {
  return quests.map(q => {
    if (!q.fulfilled) {
      const totalContrib = Object.values(q.contributions).reduce((a, b) => a + b, 0);
      if (totalContrib >= q.goal) {
        q.fulfilled = true;
        // TODO: distribute q.reward to contributing players
      }
    }
    return q;
  });
}
