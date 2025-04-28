import type { GameState, RitualQuestCard } from "@shared/types";

/**
 * Return all active quests not yet fulfilled.
 * Frontend treats `state.quests` as optional, so guard with fallback.
 */
export function openQuests(state: GameState): RitualQuestCard[] {
  return (state.quests ?? []).filter(q => !q.fulfilled);
}
