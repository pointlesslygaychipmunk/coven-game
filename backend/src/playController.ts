import { executeActions } from "./executeActions";
import { advanceTurn } from "./turnEngine";
import type { GameState } from "../../shared/types";

export function playTurn(gameState: GameState): GameState {
  const acted = executeActions(gameState);
  const advanced = advanceTurn(acted);
  return advanced;
}