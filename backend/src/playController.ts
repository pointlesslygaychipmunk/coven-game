// backend/src/playController.ts

import type { GameState, Action } from "../../shared/types";
import { executeActions } from "./executeActions";
import { advanceTurn } from "./turnEngine";
import type { MarketMemory } from "./updateMarketAI";

export function playTurn(
  state: GameState,
  actions: Action[] = [],
  playerId: string,
  memory: MarketMemory
): GameState {
  const acted = executeActions(state, actions, playerId);
  const advanced = advanceTurn(acted, memory);
  return advanced;
}