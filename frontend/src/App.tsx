import { useEffect, useReducer } from "react";
import GardenGrid from "@/components/GardenGrid";
import type { GameState, Action } from "@shared/types";
import { reducer, load } from "@/utils";

export default function App() {
  const [state, dispatch] = useReducer(reducer, null as unknown as GameState);

  // initial fetch / load
  useEffect(() => {
    fetch("/api/state")
      .then(r => r.json())
      .then((s: GameState) => { dispatch({ type: "noop" } as Action); return s; })
      .catch(() => load() ?? null)
      .then(s => s && dispatch({ type: "noop" } as Action)); // noop initialisation
  }, []);

  if (!state) {
    return <p className="h-screen grid place-content-center">Loading…</p>;
  }

  return (
    <main className="p-4">
      <GardenGrid
        tiles={state.players[0].garden}
        inventory={state.players[0].inventory}
        onAction={dispatch}
      />
    </main>
  );
}
