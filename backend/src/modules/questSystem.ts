import type { RitualQuestCard, GameState } from "../../../shared/src/types";

export function resolveQuests(quests: RitualQuestCard[], state: GameState): RitualQuestCard[] {
  const player = state.players[0];
  const shareQuest = (value:number)=> Math.floor(value * (player.id in q.contributions ? q.contributions[player.id]/q.goal : 0));

  return quests.map(q => {
    if (!q.fulfilled && q.contributions[player.id] >= q.goal) {
      q.fulfilled = true;
      if (q.reward?.gold)        player.gold        += shareQuest(q.reward.gold);
      if (q.reward?.renown)      player.renown      += shareQuest(q.reward.renown);
      if (q.reward?.craftPoints) player.craftPoints += shareQuest(q.reward.craftPoints);
    }
    return q;
  });
}
