/* frontend/src/utils.ts
   ────────────────────────────────────────────────────────── */

   import type { GameState, Action } from '@shared/types'

   /**
    * Very-small placeholder reducer that keeps the compiler happy
    * while you flesh out real gameplay logic.
    *
    * – Adds an example “plant” branch so you can see the pattern.
    * – Every other action just falls through and returns state.
    */
   export function reducer(state: GameState, action: Action): GameState {
     switch (action.type) {
       /* Example: plant a crop into the player’s garden slot */
       case 'plant': {
         const player = state.players[0]          // single-player prototype
         /* deduct one crop from inventory */
         const inventory = {
           ...player.inventory,
           [action.crop]: Math.max((player.inventory[action.crop] ?? 0) - 1, 0),
         }
         /* update the garden slot */
         const garden = player.garden.map((slot, i) =>
           i === action.index
             ? { type: action.crop, kind: 'crop', growth: 0 }
             : slot
         )
         return {
           ...state,
           players: [{ ...player, inventory, garden }],
           actionsUsed: state.actionsUsed + 1,
         }
       }
   
       default:
         return state
     }
   }   