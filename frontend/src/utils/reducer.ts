import type { GameState, Action } from "@shared/types";

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "loadState":
      return action.state;  // FULL STATE REPLACEMENT
    case "noop":
      return state;
    case "plant":
      return state;
    case "harvest":
      return state;
    case "water":
      return state;
    case "buy":
      return state;
    case "sell":
      return state;
    case "brew":
      return state;
    case "fulfill":
      return state;
    default:
      return state;
  }
}
