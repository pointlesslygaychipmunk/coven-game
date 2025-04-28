import type { GameState } from "../../../shared/src/types";

export function resolveQuests(state: GameState) {
  const player = state.players[0];

  (state.quests ?? []).forEach(q => {
    if (!q.fulfilled && q.contributions[player.id] >= q.goal) {
      q.fulfilled = true;
      const share = q.contributions[player.id] / q.goal;

      if (q.reward?.gold)        player.gold        += Math.floor(q.reward.gold        * share);
      if (q.reward?.renown)      player.renown      += Math.floor(q.reward.renown      * share);
      if (q.reward?.craftPoints) player.craftPoints += Math.floor(q.reward.craftPoints * share);

      if (q.reward?.uniqueItem) {
        state.rumors.push({
          id: crypto.randomUUID(),
          message: `You received the unique item “${q.reward.uniqueItem}” for completing “${q.title}.”`,
          source: "quest",
          timestamp: Date.now(),
        });
      }
    }
  });
}
