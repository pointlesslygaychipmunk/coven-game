import type { GameState, Action, CropType } from "@shared/types";

/** mini example reducer so you can see how to extend it */
export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "plant": {
      const newInv = {
        ...state.players[0].inventory,
        /* cast because we’re inside the `"plant"` branch */
        [action.crop as CropType]:
          state.players[0].inventory[action.crop as CropType] - 1,
      };

      const newState: GameState = {
        ...state,
        players: [{ ...state.players[0], inventory: newInv }],
      };
      return newState;
    }

    default:
      return state;
  }
}