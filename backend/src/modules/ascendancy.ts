import type { GameState, AscendancyPath } from "../../../shared/src/types";

export function computeAscendancy(state: GameState) {
  const player = state.players[0];

  const paths: Partial<Record<AscendancyPath, number>> = {
    economicMastery: player.gold,
    ritualDominance: (state.quests ?? []).filter(q => q.fulfilled).length,
    secretQuest:     (state.quests ?? []).filter(q => q.reward?.uniqueItem).length,
    rumorWeaver:     state.rumors.length,
  };

  player.ascendancy = {
    path: Object.keys(paths)[0] as AscendancyPath, // pick highest later
    progress: 0,
    unlocked: false,
  };
}
