import type { GameState, RitualQuestCard } from "@shared/types";

export default function updateAscendancy(state: GameState): void {
  state.players.forEach(player => {
    const scores = {
      '': 0,
      economicMastery: player.gold,
      ritualDominance: state.quests.filter((q: RitualQuestCard) => q.fulfilled && (q.contributions[player.id] ?? 0) > 0).length,
      secretQuest: state.quests.filter((q: RitualQuestCard) => q.reward?.uniqueItem && q.fulfilled && (q.contributions[player.id] ?? 0) > 0).length,
      rumorWeaver: state.rumors.length
    };

    const [bestPath, bestScore] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0] as [string, number];
    player.ascendancy.path = bestPath as any;
    player.ascendancy.progress = bestScore;
    player.ascendancy.unlocked = bestScore > 0;
  });
}
