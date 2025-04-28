import type { GameState, Action } from "@shared/types";

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "loadState":
      return action.state;  // FULL REPLACE with new GameState
    case "noop":
      return state;
    case "plant":
      return state; // TODO: Implement real plant action
    case "harvest":
      return state; // TODO: Implement real harvest action
    case "water":
      return state; // TODO: Implement real watering
    case "buy":
      return state; // TODO: Implement real buy logic
    case "sell":
      return state; // TODO: Implement real sell logic
    case "brew":
      return state; // TODO: Implement real brew logic
    case "fulfill":
      return state; // TODO: Implement real fulfill logic
    default:
      return state;
  }
}
