import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import type { GameState, Action } from "../../shared/types";

import StatsBar      from "./components/StatsBar";
import RumorFeed     from "./components/RumorFeed";
import GardenGrid    from "./components/GardenGrid";
import { InventoryBox } from "./components/InventoryBox";
import PotionPanel   from "./components/PotionPanel";
import { TownRequests } from "./components/TownRequests";
import { Journal }      from "./components/Journal";

const socket = io("https://playcoven.com");

const App: React.FC = () => {
  const [state, setState] = useState<GameState | null>(null);

  // grab the first (and only) player
  const playerId = state?.players[0]?.id ?? "player1";
  const player   = state?.players[0];

  useEffect(() => {
    socket.on("state", (gs: GameState) => setState(gs));
    socket.emit("register", { playerId });
    return () => void socket.off("state");
  }, [playerId]);

  if (!state || !player) {
    return <div className="min-h-screen flex items-center justify-center text-purple-700">Loading…</div>;
  }

  // helper to batch‐send actions
  const doActions = (actions: Action[]) => {
    socket.emit("executeActions", { playerId, actions });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-serif text-purple-900 p-6 space-y-6">
      {/* Top status bar */}
      <StatsBar player={player} status={state.status} />

      {/* Rumor feed */}
      <RumorFeed rumors={state.rumors} />

      <div className="flex gap-8">
        {/* Left side: garden, inventory, potions */}
        <div className="w-2/3 space-y-6">
          <div className="bg-green-50 rounded-xl p-4 ring-2 ring-green-200">
            <h2 className="text-2xl font-bold mb-4">🌾 Your Enchanted Garden</h2>
            <GardenGrid
              spaces={player.garden}
              onPlantCrop={(crop, idx) => doActions([{ type: "plant", crop, index: idx }])}
              onWater={(idx)           => doActions([{ type: "water",   index: idx }])}
              onHarvest={(idx)         => doActions([{ type: "harvest", index: idx }])}
              onPlantTree={(idx)       => doActions([{ type: "plant",   crop: "fruit", index: idx }])}
            />
          </div>

          <InventoryBox player={player} />

          <PotionPanel
            player={player}
            onBrew={(potionId: string) => doActions([{ type: "brew", potionId }])}
          />
        </div>

        {/* Right side: town requests & journal */}
        <div className="w-1/3 space-y-6">
          <TownRequests
            cards={state.townRequests}
            onFulfill={(reqId: string) => doActions([{ type: "fulfill", requestId: reqId }])}
          />
          <Journal alerts={state.journal} />
        </div>
      </div>

      {/* Advance turn button */}
      <div className="text-center">
        <button
          onClick={() => socket.emit("advanceTurn")}
          className="px-6 py-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700 transition"
        >
          🌙 End Turn
        </button>
      </div>
    </div>
  );
};

export default App;