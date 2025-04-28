import type {
  GameState,
  GameAction as Action,
  CropType,
} from "@shared/types";
import produce from "immer";

/* helper: adjust player inventory ------------------------------------ */
export function applyAction(state: GameState, action: Action): GameState {
  return produce(state, draft => {
    const me = draft.players[0];

    switch (action.type) {
      case "plant": {
        const slot = me.garden[action.index];
        if (!slot || slot.crop) break;                // already occupied
        slot.crop = action.crop;
        slot.growth = 0;
        me.inventory[action.crop]--;
        break;
      }

      case "harvest": {
        const slot = me.garden[action.index];
        if (slot && slot.crop && slot.growth >= 1) {
          me.inventory[slot.crop]++;
          slot.crop = null;
          slot.growth = 0;
        }
        break;
      }

      /* add other actions later -------------------------------------- */

      default:
        break;
    }
  });
}