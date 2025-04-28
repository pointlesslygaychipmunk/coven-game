import { useEffect, useReducer } from "react";
import { GardenGrid } from "@/components";
import type { GameState, GameAction as Action } from "@shared/types";
import "@/index.css";                       // Tailwind + global styles

/* ------------------------------------------------------------------ */
/*  Simple Immer-powered reducer – extend/replace later if you wish   */
/* ------------------------------------------------------------------ */
import produce from "immer";

function reducer(state: GameState | null, action: Action): GameState | null {
  return produce(state, draft => {
    /*  currently only “noop” from the bootstrap below – add more later */
    if (action.type === "noop") return;
  });
}

/* ------------------------------------------------------------------ */

export default function App() {
  const [state, dispatch] = useReducer(reducer, null);

  /* initial state fetch ------------------------------------------------ */
  useEffect(() => {
    fetch("/api/state")
      .then(r => r.json())
      /* dispatch a noop so the reducer is initialised _and_ return s ---- */
      .then((s: GameState) => {
        dispatch({ type: "noop" } as Action);
        return s;
      })
      .then(dispatch)
      .catch(err => console.error("state fetch failed:", err));
  }, []);

  if (!state) {
    return (
      <div className="h-screen grid place-content-center">
        Loading coven state…
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* status / nav bar could go here */}
      <main className="flex-1 overflow-auto p-4">
        <GardenGrid
          tiles={state.players[0].garden}   /* << existing game data */
          inventory={state.players[0].inventory}
          onAction={dispatch}
        />
      </main>
    </div>
  );
}
