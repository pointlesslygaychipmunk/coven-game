// backend/src/createGameState.ts
import { initialPlayerState, initialGameStatus, initialMarketState } from "../../shared/initialState";
import { generateTownRequests } from "./generateTownRequests";
import type { GameState } from "../../shared/types";

export function createGameState(): GameState {
  return {
    player: {
      ...structuredClone(initialPlayerState),
      id: crypto.randomUUID(),
      name: "Player 1",
      craftPoints: 0,
      mana: 3,
    },
    status: { ...initialGameStatus, year: 1 },
    market: structuredClone(initialMarketState),
    townRequests: generateTownRequests(),
  };
}