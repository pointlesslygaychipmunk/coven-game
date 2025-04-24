import { executeActions } from "./executeActions";
import { advanceTurn } from "./turnEngine";
import type { GameState } from "../../shared/types";
import type { Action } from "../../shared/actionTypes";

/**
 * Applies a batch of actions, then advances the game turn (moon phase, growth, etc).
 */
export function playTurn(gameState: GameState, actions: Action[] = []): GameState {
  if (!gameState || typeof gameState !== "object") {
    throw new Error("Invalid gameState object passed to playTurn.");
  }

  if (!gameState.status || typeof gameState.status !== "object") {
    throw new Error("Invalid gameState.status field in playTurn.");
  }

  // ⏯️ Step 1: Execute all queued actions (e.g. plant, harvest, etc)
  const actedState = executeActions(gameState, actions);

  // 🌙 Step 2: Advance the moon phase, apply growth, reset actionsUsed, etc.
  const advancedState = advanceTurn(actedState);

  return advancedState;
}