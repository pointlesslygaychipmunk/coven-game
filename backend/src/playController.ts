// backend/src/playController.ts

import type { GameState, Action } from "../../shared/types";
import { executeActions } from "./executeActions";
import { advanceTurn } from "./turnEngine";
import type { MarketMemory } from "./updateMarketAI";

// Default memory initializer if one doesn't already exist
const defaultMemory: MarketMemory = {
  purchases: {
    herb: 0,
    flower: 0,
    mushroom: 0,
    fruit: 0,
  },
  sales: {
    herb: 0,
    flower: 0,
    mushroom: 0,
    fruit: 0,
  },
  trends: {
    herb: [],
    flower: [],
    mushroom: [],
    fruit: [],
  },
};

export function playTurn(
  state: GameState,
  actions: Action[],
  playerId: string
): GameState {
  const acted = executeActions(state, actions, playerId);
  const advanced = advanceTurn(acted);
  return advanced;
}