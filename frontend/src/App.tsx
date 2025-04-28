import { useEffect, useReducer, useState } from "react";
import type { GameState, Action } from "@shared/types";
import { reducer, load } from "@/utils";
import GameView from "@/components/GameView";

export default function App() {
  const [state, dispatch] = useReducer(reducer, null as unknown as GameState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/state")
      .then(r => {
        if (!r.ok) throw new Error("Server error");
        return r.json();
      })
      .then((s: GameState) => {
        dispatch({ type: "loadState", state: s });
        setLoading(false);
      })
      .catch(() => {
        const fallback = load();
        if (fallback) {
          dispatch({ type: "loadState", state: fallback });
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-screen grid place-content-center bg-gradient-to-br from-black via-stone-900 to-black text-stone-200 font-serif fade-in-spell">
        <div className="text-center">
          <h1 className="text-4xl shimmer-text mb-2">Summoning the Coven…</h1>
          <p className="text-sm opacity-75">Waiting for the spirits to answer...</p>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="h-screen grid place-content-center bg-gradient-to-br from-black via-stone-900 to-black text-red-500 font-serif fade-in-spell">
        <div className="text-center">
          <h1 className="text-4xl">Something went wrong.</h1>
          <p className="text-sm opacity-75">The Coven could not be summoned.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mist-overlay"></div>
      <GameView state={state} />
    </>
  );
}
