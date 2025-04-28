import type { RitualQuestCard, GameState } from "@shared/types";

/**
 * Resolve completed ritual quests and distribute rewards to the player(s).
 * Returns an updated list of quests (with fulfilled flags updated).
 */
export function resolveQuests(
  quests: RitualQuestCard[],
  state: GameState
): RitualQuestCard[] {
  const player = state.players[0];  // (Assuming single-player context for now)

  return quests.map(q => {
    if (q.fulfilled) return q;

    const contrib = q.contributions[player.id] ?? 0;
    if (contrib < q.goal) return q;

    // Mark quest as fulfilled and give player their share of the rewards
    q.fulfilled = true;
    const share = contrib / q.goal;

    if (q.reward?.gold) {
      player.gold += Math.floor(q.reward.gold * share);
    }
    if (q.reward?.renown) {
      player.renown += Math.floor(q.reward.renown * share);
    }
    if (q.reward?.craftPoints) {
      player.craftPoints += Math.floor(q.reward.craftPoints * share);
    }
    if (q.reward?.uniqueItem) {
      state.rumors.push({
        id: crypto.randomUUID(),
        message: `You received the unique item “${q.reward.uniqueItem}” for completing “${q.title}.”`,
        source: "quest",
        timestamp: Date.now()
      });
    }

    return q;
  });
}
