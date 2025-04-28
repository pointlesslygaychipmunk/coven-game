import { useEffect, useReducer, useState } from "react";
import type { GameState } from "@shared/types";
import { reducer, load } from "@/utils";
import GameView from "@/components/GameView";

export default function App() {
  const [state, dispatch] = useReducer(reducer, null as unknown as GameState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[App.tsx] Fetching /api/state...");
    fetch("/api/state")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch state");
        console.log("[App.tsx] Response OK");
        return response.json();
      })
      .then((gameState: GameState) => {
        console.log("[App.tsx] Received gameState:", gameState);
        dispatch({ type: "loadState", state: gameState });
        console.log("[App.tsx] Dispatched loadState");
        setLoading(false);
      })
      .catch((error) => {
        console.error("[App.tsx] Error fetching state:", error);
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
