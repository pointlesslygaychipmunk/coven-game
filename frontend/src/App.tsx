/*  App.tsx  —  top-level game container
    ─────────────────────────────────────────────────────────────── */
    import { useEffect, useReducer } from "react";
    import GardenGrid from "@/components/GardenGrid";
    import Journal     from "@/components/Journal";
    import InventoryBox from "@/components/InventoryBox";
    import { AppShell } from "@/layout/AppShell";
    import type { GameState, Action, Tile, CropType } from "@shared/types";
    
    /* ---------------------------------------------------------------
       Local reducer – frontend-only optimistic updates
    ---------------------------------------------------------------- */
    function reducer(state: GameState, action: Action): GameState {
      const draft = structuredClone(state);               // cheap enough
      const tiles = draft.players[0].garden;
    
      switch (action.type) {
        case "plant": {
          const slot = tiles[action.index];
          if (slot && slot.type === action.crop) break;   // already planted
          tiles[action.index] = { type: action.crop, kind: "crop", growth: 0 };
          draft.players[0].inventory[action.crop]--;
          break;
        }
        case "water": {
          const slot = tiles[action.index];
          if (slot && slot.growth < 1) slot.growth += 0.25;
          break;
        }
        case "harvest": {
          const slot = tiles[action.index];
          if (slot && slot.growth >= 1) {
            draft.players[0].inventory[slot.type]++;
            tiles[action.index] = { type: slot.type, kind: "crop", growth: 0 };
          }
          break;
        }
        /* buy / sell / brew / fulfill etc. can be added later */
      }
      return draft;
    }
    
    /* ---------------------------------------------------------------
       Component
    ---------------------------------------------------------------- */
    export default function App() {
      const [state, dispatch] = useReducer(reducer, null as unknown as GameState);
    
      /* initial fetch ------------------------------------------------------- */
      useEffect(() => {
        (async () => {
          const res  = await fetch("/api/state");
          const data = await res.json();
          dispatch({ type: "noop" } as unknown as Action); // init
          // hacky init: replace state via dispatch wrapper
          reducer(state as unknown as GameState, { type: "noop" } as Action);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      if (!state)
        return <p className="grid h-screen place-items-center">Loading coven state…</p>;
    
      const player  = state.players[0];
      const tiles2d = chunk<Tile>(player.garden, 6);      // 6-wide grid
    
      return (
        <AppShell>
          <Journal />
          <main className="flex-1 overflow-y-auto p-4">
            <GardenGrid
              tiles={tiles2d}
              onAction={dispatch}
              inventory={player.inventory as Record<CropType, number>}
            />
          </main>
          <aside className="w-72 shrink-0 space-y-4 p-4">
            <InventoryBox items={player.inventory} />
          </aside>
        </AppShell>
      );
    }
    
    /* helper ------------------------------------------------------------ */
    function chunk<T>(arr: T[], size: number): T[][] {
      return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
      );
    }
    