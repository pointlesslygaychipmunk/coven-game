import { useEffect, useReducer } from 'react';
import GardenGrid         from './components/GardenGrid';
import InventoryBox       from './components/InventoryBox';
import Journal            from './components/Journal';
import { AppShell }       from '@/layout/AppShell';
import type {
  GameState,
  Action,
  CropType,
  Tile,
} from '@shared/types';

/* ------------------------------------------------------------------
   Reducer – real INIT action replaces the former “noop” hack
------------------------------------------------------------------- */

type InitAction = { type: 'INIT'; payload: GameState };
type ReducerAction = Action | InitAction;

function reducer(state: GameState | null, action: ReducerAction): GameState {
  if (action.type === 'INIT') return action.payload;

  /* --- demo garden logic (plant / harvest) ---------------------- */
  if (!state) return state as never;          // should never run before INIT

  switch (action.type) {
    case 'plant': {
      const { index, crop } = action;
      const slot = state.players[0].garden[index];
      if (slot.type !== null) return state;
      if (state.players[0].inventory[crop] === 0) return state;

      return {
        ...state,
        players: state.players.map((p, i) =>
          i === 0
            ? {
                ...p,
                inventory: {
                  ...p.inventory,
                  [crop]: p.inventory[crop] - 1,
                },
                garden: p.garden.map((s, j) =>
                  j === index ? { ...s, type: crop, growth: 0 } : s,
                ),
              }
            : p,
        ),
      };
    }

    case 'harvest': {
      const { index } = action;
      const slot = state.players[0].garden[index];
      if (slot.type === null) return state;

      const crop = slot.type;
      return {
        ...state,
        players: state.players.map((p, i) =>
          i === 0
            ? {
                ...p,
                inventory: {
                  ...p.inventory,
                  [crop]: p.inventory[crop] + 1,
                },
                garden: p.garden.map((s, j) =>
                  j === index ? { ...s, type: null, growth: 0 } : s,
                ),
              }
            : p,
        ),
      };
    }

    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */

export default function App() {
  const [state, dispatch] = useReducer(reducer, null);

  /* fetch the initial game state exactly once */
  useEffect(() => {
    fetch('/api/state')
      .then(r => r.json())
      .then((s: GameState) => dispatch({ type: 'INIT', payload: s }))
      .catch(err => console.error('state fetch failed:', err));
  }, []);

  if (!state)
    return (
      <div className="h-screen grid place-content-center">
        Loading coven state…
      </div>
    );

  return (
    <AppShell>
      <Journal />
      <main className="p-4 flex-1 overflow-y-auto">
        <GardenGrid
          tiles={chunk(state.players[0].garden, 8) as Tile[][]}
          inventory={state.players[0].inventory}
          onAction={dispatch as (a: Action) => void}
        />
      </main>
      <aside className="p-4 w-72 shrink-0 space-y-4">
        <InventoryBox items={state.players[0].inventory} />
      </aside>
    </AppShell>
  );
}

/* simple helper so we don’t pull in lodash */
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size)
    out.push(arr.slice(i, i + size));
  return out;
}