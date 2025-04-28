/**
 * Advance the game one turn: apply player actions, run world logic,
 * update quests + ascendancy, return the next immutable GameState.
 */
import { produce }              from "immer";
import type { Action, GameState } from "../../shared/src/types";

import { applyMarketEvents }    from "./marketEvents";
import updateAscendancy         from "./modules/ascendancy";
import { resolveQuests }        from "./modules/questSystem";

export function nextTurn(state: GameState, actions: Action[]): GameState {
  const newState = produce(state, draft => {
    /* ─── execute each Action (toy impl) ───────────────────── */
    for (const action of actions) {
      if (action.type === "plant") {
        const slot = draft.players[0].garden[action.index];
        if (slot && !slot.crop) {
          slot.crop = action.crop;
          slot.growth = 0;
        }
      }
      // …handle other action kinds here…
    }
    draft.actionsUsed += actions.length;
  });

  /* ─── world simulation ───────────────────────────────────── */
  applyMarketEvents(newState);
  newState.quests = resolveQuests(newState.quests ?? [], newState);
  updateAscendancy(newState);

  return newState;
}