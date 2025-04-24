import { executeActions } from "./executeActions";
import { advanceTurn } from "./turnEngine";
import type { GameState } from "../../shared/types";
import type { Action } from "./executeActions";

export function playTurn(gameState: GameState, actions: Action[]): GameState {
    const acted = executeActions(gameState, actions);
    const advanced = advanceTurn(acted);
    return advanced;
  }  