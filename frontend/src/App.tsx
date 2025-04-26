// frontend/src/App.tsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import type { GameState, Action } from "../../shared/types";

import { StatsBar }     from "./components/StatsBar";
import { GardenGrid }   from "./components/GardenGrid";
import { InventoryBox } from "./components/InventoryBox";
import { PotionPanel }  from "./components/PotionPanel";
import { Market }       from "./components/Market";
import { RumorFeed }    from "./components/RumorFeed";
import { TownRequests } from "./components/TownRequests";
import { Journal }      from "./components/Journal";

const socket = io("https://playcoven.com");

const App: React.FC = () => {
  const [state, setState] = useState<GameState | null>(null);
  const playerId = state?.players[0]?.id ?? "player1";

  useEffect(() => {
    socket.on("state", (gs: GameState) => setState(gs));
    socket.emit("register", { playerId });
    return () => { socket.off("state"); };
  }, [playerId]);

  if (!state) return <div className="text-purple-200">Loading…</div>;
  const player = state.players[0];

  const doActions = (actions: Action[]) =>
    socket.emit("executeActions", { playerId, actions });

  return (
    <div className="
      min-h-screen 
      bg-[url('/parchment-texture.png')] bg-cover bg-fixed 
      text-purple-900 font-serif 
      p-8 space-y-8
    ">
      {/* 🌌 World Status */}
      <div className="
        flex justify-between items-center 
        bg-purple-800 bg-opacity-20 rounded-lg 
        p-4 ring-1 ring-purple-400
      ">
        <span>📅 Year {state.status.year}, {state.status.season}</span>
        <span>🌙 Moon Phase {state.status.moonPhase}</span>
        <span>☀️ Weather: {state.status.weather}</span>
      </div>

      {/* 🏰 Player Stats */}
      <div className="bg-white/80 rounded-lg p-4 ring-1 ring-purple-200">
        <StatsBar player={player} />
      </div>

      {/* 🌱 Garden & 📦 Inventory & ⚗️ Potion */}
      <div className="flex gap-8">
        <div className="w-1/2 space-y-4">
          <div className="bg-white/90 rounded-lg p-4 ring-1 ring-green-300">
            <GardenGrid
              spaces={player.garden}
              player={player}
              onPlantCrop={(crop, idx) =>
                doActions([{ type: "plant", crop, index: idx }])
              }
              onPlantTree={idx =>
                doActions([{ type: "plant", crop: "fruit", index: idx }])
              }
              onHarvest={idx =>
                doActions([{ type: "harvest", index: idx }])
              }
            />
          </div>
          <div className="bg-white/90 rounded-lg p-4 ring-1 ring-yellow-300">
            <InventoryBox player={player} />
          </div>
        </div>
        <div className="w-1/2">
          <div className="bg-white/90 rounded-lg p-4 ring-1 ring-indigo-300">
            <PotionPanel
              potions={player.potions}
              inventory={player.inventory}
              onBrew={p =>
                doActions([{ type: "brew", potionId: p.id }])
              }
            />
          </div>
        </div>
      </div>

      {/* 🏬 Market & 🗣 Rumors */}
      <div className="flex gap-6">
        <div className="flex-1 bg-white/90 rounded-lg p-4 ring-1 ring-purple-200">
          <Market
            marketItems={state.market.items}
            onBuy={id => doActions([{ type: "buy", itemId: id, quantity: 1 }])}
            onSell={id => doActions([{ type: "sell", itemId: id, quantity: 1 }])}
          />
        </div>
        <div className="w-1/3 bg-white/90 rounded-lg p-4 ring-1 ring-purple-200">
          <RumorFeed />
        </div>
      </div>

      {/* 📜 Town Requests */}
      <div className="bg-white/90 rounded-lg p-4 ring-1 ring-blue-300">
        <TownRequests
          cards={state.townRequests}
          onFulfill={requestId =>
            doActions([{ type: "fulfill", requestId }])
          }
        />
      </div>

      {/* 🕯 Journal */}
      <div className="bg-white/80 rounded-lg p-4 ring-1 ring-purple-200">
        <Journal alerts={state.journal} />
      </div>

      {/* ▶️ Advance Turn */}
      <button
        onClick={() => socket.emit("advanceTurn")}
        className="
          mt-4 px-6 py-2 
          bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-600 
          text-white font-bold rounded-full shadow-lg 
          hover:from-purple-600 hover:to-indigo-500
        "
      >
        Advance Turn
      </button>
    </div>
  );
};

export default App;