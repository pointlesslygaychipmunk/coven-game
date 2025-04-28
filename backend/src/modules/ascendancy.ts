import type { GameState, AscendancyPath } from "../../../shared/src/types";

/**
 * Re-compute the player’s ascendancy progress after a turn.
 * Chooses the path with the highest score; keeps blank when nothing earned.
 */
export default function updateAscendancy(state: GameState): void {
  const player = state.players[0];

  const scores: Record<AscendancyPath, number> = {
    "":                0,
    economicMastery:   player.gold,
    ritualDominance:   (state.quests ?? []).filter(q => q.fulfilled).length,
    secretQuest:       (state.quests ?? []).filter(q => q.reward?.uniqueItem).length,
    rumorWeaver:       state.rumors.length,
  };

  const [bestPath, bestScore] = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])[0] as [AscendancyPath, number];

  player.ascendancy = {
    path: bestPath,
    progress: bestScore,
    unlocked: bestScore > 0,
  };
}
