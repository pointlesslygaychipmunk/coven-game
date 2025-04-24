import React, { useEffect, useState } from "react";
import { GardenGrid } from "./GardenGrid";
import { InventoryBox } from "./InventoryBox";
import { UpgradeShop } from "./UpgradeShop";
import { GameStatusBar } from "./GameStatusBar";
import { TownRequests } from "./TownRequests";
import type { TownRequestCard } from "./TownRequests";
import { MarketView } from "./MarketView";
import { GameOver } from "./GameOver";
import { calculateScore } from "../../../shared/scoreLogic";
import type { Player, GameStatus } from "../../../shared/types";
import type { Action } from "../../../shared/actionTypes";

export const Layout = ({
  gameState,
  setGameState,
  gameOver,
  setGameOver,
  scoreData,
  setScoreData,
}: {
  gameState: any;
  setGameState: any;
  gameOver: boolean;
  setGameOver: (val: boolean) => void;
  scoreData: any;
  setScoreData: (val: any) => void;
}) => {
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    fetch("https://api.telecrypt.xyz/init")
      .then((res) => res.json())
      .then((data) => {
        console.log("🎮 Initial game state loaded:", data);
        setGameState(data);
      })
      .catch((err) => console.error("Initial load error:", err));
  }, []);

  if (gameOver && scoreData) {
    return (
      <GameOver
        score={scoreData.total}
        breakdown={scoreData.breakdown}
        lost={scoreData.lost}
      />
    );
  }

  const handlePlant = (type: 'mushroom' | 'flower' | 'herb' | 'fruit', index: number) => {
    setActions(prev => [...prev, { type: "plant", plotIndex: index, itemType: type }]);
  };

  const handleAdvanceTurn = () => {
    fetch("https://api.telecrypt.xyz/play-turn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState, actions })
    })
      .then(res => res.json())
      .then(data => {
        setGameState(data);
        setActions([]);
        if (data.gameOver) {
          setGameOver(true);
          setScoreData(calculateScore(data));
        }
      })
      .catch(err => console.error("Advance error:", err));
  };

  return (
    <div className="p-4 space-y-4 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 min-h-screen">
      <GameStatusBar status={gameState?.status} />

      <div className="flex flex-row gap-6 items-start">
        <div className="flex flex-col gap-4 w-1/2">
          <GardenGrid
            spaces={gameState.player.garden.spaces}
            onPlantCrop={handlePlant}
            onPlantTree={() => {}} // no-op for now
            player={gameState.player}
          />
          <InventoryBox player={gameState.player} />
          <UpgradeShop upgrades={gameState.player.upgrades} onUpgrade={() => {}} />
        </div>

        <div className="flex flex-col gap-4 w-1/2">
          <TownRequests cards={gameState.townRequests} onFulfill={() => {}} />
          {gameState?.market && (
            <MarketView
              market={gameState.market}
              onBuy={() => {}}
              onSell={() => {}}
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
    </div>
  );
};