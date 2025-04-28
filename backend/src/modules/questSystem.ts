import type { RitualQuestCard, GameState } from "../shared/types";

/**
 * Resolve quests and distribute rewards.
 * Returns the updated quest array so callers can assign it back.
 */
export function resolveQuests(
  quests: RitualQuestCard[],
  state: GameState
): RitualQuestCard[] {
  const player = state.players[0];

  return quests.map(q => {
    if (q.fulfilled) return q;

    const contrib = q.contributions[player.id] ?? 0;
    if (contrib < q.goal) return q;

    const share = contrib / q.goal;
    q.fulfilled = true;

    if (q.reward?.gold)
      player.gold += Math.floor(q.reward.gold * share);
    if (q.reward?.renown)
      player.renown += Math.floor(q.reward.renown * share);
    if (q.reward?.craftPoints)
      player.craftPoints += Math.floor(q.reward.craftPoints * share);

    if (q.reward?.uniqueItem) {
      state.rumors.push({
        id:        crypto.randomUUID(),
        message:   `You received the unique item “${q.reward.uniqueItem}” for completing “${q.title}.”`,
        source:    "quest",
        timestamp: Date.now(),
      });
    }
    return q;
  });
}
