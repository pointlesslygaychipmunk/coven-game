import type { GameState, GameAction, GardenSlot } from "@shared/types";

export function createEmptyGarden(size = 12): GardenSlot[] {
  return Array.from({ length: size }, () => ({
    type: "mushroom",
    kind: "crop",
    growth: 0,
  }));
}

/** naïve reducer for demo purposes – extend as needed */
export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "plant": {
      const garden = [...state.players[0].garden];
      garden[action.index] = {
        type: action.crop,
        kind: "crop",
        growth: 0,
      };
      return {
        ...state,
        players: [
          {
            ...state.players[0],
            garden,
            inventory: {
              ...state.players[0].inventory,
              [action.crop]: state.players[0].inventory[action.crop] - 1,
            },
          },
        ],
      };
    }
    default:
      return state;
  }
}