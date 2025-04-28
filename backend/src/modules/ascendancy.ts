import type { GameState, AscendancyPath } from "../../../shared/src/types";

export function updateAscendancy(state: GameState): void {
  const player = state.players[0];

  const scores: Record<AscendancyPath, number> = {
    economicMastery: player.gold,
    ritualDominance: (state.quests ?? []).filter(q => q.fulfilled).length,
    secretQuest:     (state.quests ?? []).filter(q => q.reward?.uniqueItem).length,
    rumorWeaver:     state.rumors.length,
    "": 0, // blank key for fresh save-files
  };

  const best = Object.entries(scores).sort((a,b)=>b[1]-a[1])[0]!;
  player.ascendancy = { path: best[0], progress: best[1], unlocked: best[1] > 0 };
}

export default updateAscendancy;
