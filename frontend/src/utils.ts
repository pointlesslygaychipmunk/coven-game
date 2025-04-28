// frontend/src/utils.ts
import { produce } from "immer";
import type { GameState, GameAction, CropType } from "@shared/types";

/** LocalStorage key for quick prototyping */
const KEY = "coven-dev-state";

// -----------------------------------------------------------------------------
// Serialise helpers
// -----------------------------------------------------------------------------
export const save = (state: GameState) =>
  localStorage.setItem(KEY, JSON.stringify(state));

export const load = (): GameState | null => {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as GameState) : null;
};

// -----------------------------------------------------------------------------
// Single–file reducer prototype
// -----------------------------------------------------------------------------
export const reducer = (state: GameState, action: GameAction): GameState =>
  produce(state, draft => {
    switch (action.type) {
      case "noop":
        /* used for initialisation when we load from fetch() */
        return;
      case "plant": {
        const slot = draft.players[0].garden[action.index];
        if (slot.crop) return;                // already occupied
        slot.crop = action.crop;
        slot.growth = 0;
        draft.players[0].inventory[action.crop] =
          (draft.players[0].inventory[action.crop] ?? 0) - 1;
        return;
      }
      case "water": {
        draft.players[0].garden[action.index].growth += 0.1;
        return;
      }
      // TODO other actions …
    }
  });
