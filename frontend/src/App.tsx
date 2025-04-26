// frontend/src/App.tsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import type { GameState, Action } from "../../shared/types";
import { Market }       from "./components/Market";
import { TownRequests } from "./components/TownRequests";
import { Journal }      from "./components/Journal";
import { RumorFeed }    from "./components/RumorFeed";
import { StatsBar }     from "./components/StatsBar";
import { GardenGrid }   from "./components/GardenGrid";
import { InventoryBox } from "./components/InventoryBox";
import { PotionPanel }  from "./components/PotionPanel";

const socket = io("https://playcoven.com");

const App: React.FC = () => {
  const [state, setState] = useState<GameState | null>(null);
  const playerId = state?.players[0]?.id ?? "player1";

  // subscribe to live updates
  useEffect(() => {
    socket.on("state", (gs: GameState) => setState(gs));
    socket.emit("register", { playerId });
    return () => { socket.off("state"); };
  }, [playerId]);

  if (!state) return <div>Loading…</div>;
  const player = state.players[0];

  const doActions = (actions: Action[]) =>
    socket.emit("executeActions", { playerId, actions });

  return (
    <div className="p-4 space-y-6">
      {/* Status bar */}
      <div className="flex justify-between">
        <span>📅 Year {state.status.year}, {state.status.season}</span>
        <span>🌙 Moon {state.status.moonPhase}</span>
        <span>☀️ {state.status.weather}</span>
      </div>

      {/* Player stats */}
      <StatsBar player={player} />

      {/* Garden + Inventory + Potion crafting */}
      <div className="flex gap-6">
        <div className="w-1/2 space-y-4">
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
          <InventoryBox player={player} />
        </div>
        <PotionPanel
          potions={player.potions}
          inventory={player.inventory}
          onBrew={potion =>
            doActions([{ type: "brew", potionId: potion.id }])
          }
        />
      </div>

      {/* Market & Rumors */}
      <div className="flex gap-6">
        <Market
          marketItems={state.market.items}
          onBuy={id =>
            doActions([{ type: "buy", itemId: id, quantity: 1 }])
          }
          onSell={id =>
            doActions([{ type: "sell", itemId: id, quantity: 1 }])
          }
        />
        <RumorFeed />
      </div>

      {/* Town requests */}
      <TownRequests
        cards={state.townRequests}
        onFulfill={requestId =>
          doActions([{ type: "fulfill", requestId }])
        }
      />

      {/* Journal */}
      <Journal alerts={state.journal} />

      {/* Advance turn */}
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