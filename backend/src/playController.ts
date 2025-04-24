import type { GameState } from "../../shared/types";
import type { Action } from "../../shared/actionTypes";
import { executeActions } from "./executeActions";
import { advanceTurn } from "./turnEngine";

export function playTurn(state: GameState, actions: Action[] = []): GameState {
  const acted = executeActions(state, actions);
  const advanced = advanceTurn(acted);
  return advanced;
}