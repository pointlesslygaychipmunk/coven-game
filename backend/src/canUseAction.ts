import type { GameState } from "@shared/types";

/** Check if a player can still use an action this turn (max 2 actions per turn). */
export function canUseAction(gameState: GameState): boolean {
  return (gameState.actionsUsed ?? 0) < 2;
}

/** Increment the actionsUsed counter for the turn and return the updated state. */
export function incrementActionsUsed(gameState: GameState): GameState {
  return {
    ...gameState,
    actionsUsed: (gameState.actionsUsed ?? 0) + 1
  };
}
