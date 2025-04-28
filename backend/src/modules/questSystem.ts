import type { RitualQuestCard, GameState } from '../../shared/src/types';

export function resolveQuests(quests: RitualQuestCard[], state: GameState): RitualQuestCard[] {
  return quests.map(q => {
    const total = Object.values(q.contributions).reduce((a, b) => a + b, 0);
    if (total >= q.goal) {
      q.fulfilled = true;
      if (q.reward?.uniqueItem) {
        state.journal.push(`✨ The world quest "${q.title}" succeeded!`);
      }
    }
    return q;
  });
}
