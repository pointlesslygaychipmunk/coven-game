// backend/src/modules/ascendancy.ts

import { Player, GameState, AscendancyStatus, AscendancyPath } from '../../../shared/types';

/**
 * Checks a player's stats each turn and updates their ascendancy progress.
 * Returns a journal entry if a new path is unlocked or fully ascended.
 */
export function updateAscendancy(
  player: Player,
  state: GameState
): string | undefined {
  // 1) Initialize if missing
  if (!player.ascendancy) {
    player.ascendancy = {
      path: 'economicMastery',
      progress: 0,
      unlocked: false,
    };
  }

  const asc = player.ascendancy;
  const paths: Record<AscendancyPath, number> = {
    economicMastery: player.gold,                           // total gold held
    ritualDominance: state.quests.filter(q => q.fulfilled).length, // quests done
    secretQuest: state.quests.filter(q => q.reward?.uniqueItem).length,
    rumorWeaver: state.rumors.filter(r => r.message.includes(player.name)).length,
  };

  // 2) If not yet unlocked, find the path with max metric and switch if changed
  if (!asc.unlocked) {
    const best: AscendancyPath = (Object.keys(paths) as AscendancyPath[])
      .reduce((a, b) => (paths[a] > paths[b] ? a : b));
    if (best !== asc.path) {
      asc.path = best;
      asc.progress = 0;
      return `✨ ${player.name} feels drawn toward the path of ${best}!`;
    }
  }

  // 3) Advance progress on current path
  const metric = paths[asc.path];
  // Normalize to a 0–100 scale: you decide thresholds
  const threshold = 10; // e.g. each 10 points = 1 progress
  const newProg = Math.min(100, Math.floor(metric / threshold));
  if (newProg > asc.progress) {
    asc.progress = newProg;
  }

  // 4) Unlock at 100%
  if (asc.progress >= 100 && !asc.unlocked) {
    asc.unlocked = true;
    return `🏆 ${player.name} has mastered the path of ${asc.path} and ascends!`;
  }

  return undefined;
}