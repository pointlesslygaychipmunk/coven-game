// frontend/src/components/Layout.tsx
import React, { useEffect } from "react";
import { GardenGrid } from "./GardenGrid";
import { InventoryBox } from "./InventoryBox";
import { GameStatusBar } from "./GameStatusBar";
import { TownRequests } from "./TownRequests";
import { Market } from "./Market";
import { GameOver } from "./GameOver";
import { Journal } from "./Journal";
import type { GameState } from "../../../shared/types";

export const Layout = ({
  gameState,
  setGameState,
  gameOver,
  setGameOver,
  scoreData,
  setScoreData,
}: {
  gameState: GameState;
  setGameState: (val: GameState) => void;
  gameOver: boolean;
  setGameOver: (val: boolean) => void;
  scoreData: any;
  setScoreData: (val: any) => void;
}) => {
  useEffect(() => {
    fetch("https://api.telecrypt.xyz/init")
      .then((res) => res.json())
      .then((data) => {
        console.log("🎮 Initial game state loaded:", data);
        setGameState(data);
      })
      .catch((err) => console.error("Initial load error:", err));
  }, []);

  const postUpdate = (path: string, payload: any) => {
    fetch(`https://api.telecrypt.xyz/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => setGameState(data))
      .catch((err) => console.error(`${path} error:`, err));
  };

  const handlePlantCrop = (crop: "mushroom" | "flower" | "herb", index: number) => {
    postUpdate("execute-actions", {
      gameState,
      actions: [{ type: "plant", crop, index }],
    });
  };

  const handlePlantTree = (plotIndex: number) => {
    postUpdate("execute-actions", {
      gameState,
      actions: [{ type: "plant", itemType: "fruit", plotIndex }],
    });
  };

  const handleHarvest = (plotIndex: number) => {
    postUpdate("execute-actions", {
      gameState,
      actions: [{ type: "harvest", plotIndex }],
    });
  };

  const handleFulfill = (index: number) => {
    fetch("https://api.telecrypt.xyz/fulfill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, gameState }),
    })
      .then((res) => res.json())
      .then((data) => setGameState(data))
      .catch((err) => console.error("Fulfill error:", err));
  };

  const handleAdvanceTurn = () => {
    postUpdate("play-turn", { gameState, actions: [] });
  };

  const player = gameState.players[0];

  if (gameOver && scoreData) {
    return (
      <GameOver
        score={scoreData.total}
        breakdown={scoreData.breakdown}
        lost={scoreData.lost}
      />
    );
  }

  return (
    <div className="p-4 space-y-4 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 min-h-screen">
      <GameStatusBar status={gameState?.status} />

      <div className="flex flex-row gap-6 items-start">
        <div className="flex flex-col gap-4 w-1/2">
          <GardenGrid
            spaces={player.garden}
            player={player}
            onPlantCrop={handlePlantCrop}
            onPlantTree={handlePlantTree}
            onHarvest={handleHarvest}
          />
          <InventoryBox player={player} />
        </div>

        <div className="flex flex-col gap-4 w-1/2">
          <TownRequests
            cards={gameState.townRequests}
            onFulfill={handleFulfill}
          />
          {gameState?.market && (
            <Market
              market={gameState.market}
              onBuy={(item) =>
                postUpdate("execute-actions", {
                  gameState,
                  actions: [{ type: "buy", item, quantity: 1 }],
                })
              }
              onSell={(item) =>
                postUpdate("execute-actions", {
                  gameState,
                  actions: [{ type: "sell", item, quantity: 1 }],
                })
              }
            />
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="mt-4 px-6 py-3 bg-pink-300 hover:bg-pink-400 text-white font-bold shadow-lg rounded-full transition-transform transform hover:scale-105 border border-white/60 backdrop-blur"
          onClick={handleAdvanceTurn}
        >
          🌙 End Turn / Advance Moon
        </button>
      </div>

      {player?.alerts && <Journal alerts={player.alerts} />}
    </div>
  );
};