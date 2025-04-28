import produce from 'immer';
import type { GameState, GameAction } from '@shared/types';

/** purely functional reducer – mutations are done via Immer drafts */
export function reducer(state: GameState, action: GameAction): GameState {
  return produce(state, draft => {
    switch (action.type) {
      case 'plant': {
        draft.players[0].inventory[action.crop]! -= 1;
        const slot = draft.players[0].garden[action.index];
        draft.players[0].garden[action.index] = {
          ...slot,
          crop: action.crop,
          growth: 0,
          watered: false,
          dead: false,
        };
        break;
      }

      case 'water': {
        draft.players[0].garden[action.index].watered = true;
        break;
      }

      /* …additional action cases trimmed for brevity… */

      default:
        /* exhaustive-check assistance */
        (action satisfies never);
    }
  });
}