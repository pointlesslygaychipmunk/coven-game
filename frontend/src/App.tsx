// frontend/src/App.tsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import type { GameState, Action, CropType } from "../../shared/types";

import StatsBar from "./components/StatsBar";
import GardenGrid from "./components/GardenGrid";
import InventoryBox from "./components/InventoryBox";
import PotionPanel from "./components/PotionPanel";
import Market from "./components/Market";
import TownRequests from "./components/TownRequests";
import RumorFeed from "./components/RumorFeed";
import Journal from "./components/Journal";

const socket = io("https://playcoven.com");

const App: React.FC = () => {
  const [state, setState] = useState<GameState | null>(null);
  const [journalOpen, setJournalOpen] = useState(false);
  const playerId = state?.players[0]?.id ?? "player-1";

  useEffect(() => {
    socket.on("state", (gs: GameState) => setState(gs));
    socket.emit("register", { playerId });
    return () => { socket.off("state"); };
  }, [playerId]);

  const sendAction = (action: Action) => {
    socket.emit("executeActions", { playerId, actions: [action] });
  };

  if (!state) return <div className="text-purple-700">Loading Coven…</div>;

  const { players, market, townRequests, rumors, journal, status } = state;
  const player = players[0];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 min-h-screen">
      <StatsBar player={player} status={status} />

      <div className="grid grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-4">
          <GardenGrid
            spaces={player.garden}
            player={player}
            onPlantCrop={(crop: CropType, idx: number) =>
              sendAction({ type: "plant", crop, index: idx })
            }
            onPlantTree={(idx: number) =>
              sendAction({ type: "plant", crop: "fruit", index: idx })
            }
            onWater={(idx: number) =>
              sendAction({ type: "water", index: idx })
            }
            onHarvest={(idx: number) =>
              sendAction({ type: "harvest", index: idx })
            }
          />
          <InventoryBox player={player} />
          <PotionPanel
            player={player}
            onBrew={(potionId: string) =>
              sendAction({ type: "brew", potionId })
            }
          />
        </div>

        {/* Right */}
        <div className="space-y-4">
          <Market
            marketItems={market.items}
            onBuy={(itemId: string) =>
              sendAction({ type: "buy", itemId, quantity: 1 })
            }
            onSell={(itemId: string) =>
              sendAction({ type: "sell", itemId, quantity: 1 })
            }
          />
          <TownRequests
            cards={townRequests}
            onFulfill={(requestId: string) =>
              sendAction({ type: "fulfill", requestId })
            }
          />
          <RumorFeed rumors={rumors} />
        </div>
      </div>

      <Journal
        alerts={journal}
        open={journalOpen}
        onToggle={() => setJournalOpen(o => !o)}
      />

      <div className="flex justify-center">
        <button
          onClick={() => socket.emit("advanceTurn")}
          className="mt-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition"
        >
          🌙 Advance Moon
        </button>
      </div>
    </div>
  );
};

export default App;