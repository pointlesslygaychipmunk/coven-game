// backend/src/canUseAction.ts

import type { GameState } from "../../shared/src/types";

export function canUseAction(gameState: GameState): boolean {
  return (gameState.actionsUsed ?? 0) < 2;
}

export function incrementActionsUsed(gameState: GameState): GameState {
  return {
    ...gameState,
    actionsUsed: (gameState.actionsUsed ?? 0) + 1
  };
}
