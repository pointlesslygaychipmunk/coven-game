import type { GameState, GameAction, CropType } from "@shared/types";

export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "plant":
      return {
        ...state,
        players: state.players.map(p =>
          p === state.players[0]
            ? {
                ...p,
                inventory: {
                  ...p.inventory,
                  [action.crop]:
                    (p.inventory[action.crop as CropType] ?? 0) - 1
                }
              }
            : p
        )
      };

    /* —— other actions here —— */
    default:
      return state;
  }
}