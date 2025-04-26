import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import type { GameState, Action } from "../../shared/types";
import { Market } from "./components/Market";
import { TownRequests } from "./components/TownRequests";
import { Journal } from "./components/Journal";
import { MarketMemory } from "./components/MarketMemory";

const socket = io("http://localhost:8080");

const App: React.FC = () => {
  const [state, setState] = useState<GameState | null>(null);
  const playerId = state?.players[0]?.id || "player1";

  useEffect(() => {
    socket.on("state", (gs: GameState) => setState(gs));
    socket.emit("register", { playerId });
    return () => {
      socket.off("state");
    };
  }, [playerId]);

  const sendActions = (actions: Action[]) => {
    socket.emit("executeActions", { playerId, actions });
  };

  if (!state) return <div>Loading…</div>;

  return (
    <div className="p-4 space-y-6">
      <Market
        marketItems={state.market.items}
        onBuy={(id) => sendActions([{ type: "buy", itemId: id, quantity: 1 }])}
        onSell={(id) => sendActions([{ type: "sell", itemId: id, quantity: 1 }])}
        onAcquireBlack={(id) =>
          sendActions([{ type: "buy", itemId: id, quantity: 1 }])
        }
      />

      <TownRequests
        cards={state.townRequests}
        onFulfill={(reqId) =>
          sendActions([{ type: "fulfill", requestId: reqId }])
        }
      />

      <Journal alerts={state.journal} />
      <MarketMemory entries={state.players[0].memory ?? []} />

      <button
        onClick={() => socket.emit("advanceTurn")}
        className="px-4 py-2 bg-purple-600 text-white rounded"
      >
        Advance Turn
      </button>
    </div>
  );
};

export default App;