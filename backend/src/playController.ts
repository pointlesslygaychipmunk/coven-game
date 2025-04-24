import { executeActions } from "./executeActions";
import { advanceTurn } from "./turnEngine";
import type { GameState } from "../../shared/types";
import type { Action } from "../../shared/actionTypes";

export function playTurn(gameState: GameState, actions: Action[] = []): GameState {
    if (!gameState || typeof gameState !== "object") {
      console.error("playTurn: invalid gameState:", gameState);
      return gameState;
    }
  
    if (!gameState.status) {
      console.error("playTurn: gameState.status is undefined:", gameState);
      return gameState;
    }
  
    const acted = executeActions(gameState, actions);
    const advanced = advanceTurn(acted);
    return advanced;
  }  