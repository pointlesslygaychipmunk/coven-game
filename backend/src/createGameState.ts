import { initialPlayerState, initialMarketState, initialGameStatus } from "../../shared/initialState";
import { generateTownRequests } from "./generateTownRequests";
import type { GameState } from "../../shared/types";

export function createGameState(): GameState {
  return {
    player: { ...initialPlayerState },
    market: { ...initialMarketState },
    status: { ...initialGameStatus },
    townRequests: generateTownRequests(),
  };
}