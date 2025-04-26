// frontend/src/App.tsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import type { GameState, Action } from "../../shared/types";
import { Market } from "./components/Market";
import { TownRequests } from "./components/TownRequests";
import { Journal } from "./components/Journal";

const socket = io("https://playcoven.com"); // or your duckdns domain

export const App: React.FC = () => {
  const [state, setState] = useState<GameState | null>(null);
  const playerId = state?.players[0]?.id || "player1";

  useEffect(() => {
    socket.on("state", (gs: GameState) => setState(gs));
    socket.emit("register", { playerId });
    return () => void socket.off("state");
  }, [playerId]);

  if (!state) return <div>Loading…</div>;

  return (
    <div className="p-4 space-y-6">
      {/* ← Moon/Date/Weather bar */}
      <div className="flex justify-between items-center mb-4">
        <span>📅 Year {state.status.year}, {state.status.season}</span>
        <span>🌙 Moon Phase {state.status.moonPhase}</span>
        <span>☀️ Weather: {state.status.weather}</span>
      </div>

      <Market
        marketItems={state.market.items}
        onBuy={id => socket.emit("executeActions", { playerId, actions: [{ type: "buy", itemId: id, quantity: 1 }] })}
        onSell={id => socket.emit("executeActions", { playerId, actions: [{ type: "sell", itemId: id, quantity: 1 }] })}
        onAcquireBlack={id => socket.emit("executeActions", { playerId, actions: [{ type: "buy", itemId: id, quantity: 1 }] })}
      />

      <TownRequests
        cards={state.townRequests}
        onFulfill={reqId => socket.emit("executeActions", { playerId, actions: [{ type: "fulfill", requestId: reqId }] })}
      />

      <Journal alerts={state.journal} />

      <button
        onClick={() => socket.emit("advanceTurn")}
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
      >
        Advance Turn
      </button>
    </div>
  );
};

export default App;