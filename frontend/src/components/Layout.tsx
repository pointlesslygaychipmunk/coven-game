import React, { useEffect, useCallback } from "react";
import { GardenGrid } from "./GardenGrid";
import { InventoryBox } from "./InventoryBox";
import { UpgradeShop } from "./UpgradeShop";
import { GameStatusBar } from "./GameStatusBar";
import { TownRequests } from "./TownRequests";
import type { TownRequestCard } from "./TownRequests";
import { MarketView } from "./MarketView";
import { GameOver } from "./GameOver";
import { calculateScore } from "../../../backend/src/gameOverLogic";
import type { GameState, PotionType } from "../../../shared/types";

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
  scoreData: { total: number; breakdown: any; lost: boolean };
  setScoreData: (val: { total: number; breakdown: any; lost: boolean }) => void;
}) => {
  useEffect(() => {
    fetch("https://coven-backend.onrender.com/init")
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

  const postToBackend = useCallback(
    (endpoint: string, payload: any, callback?: (data: GameState) => void) => {
      fetch(`https://coven-backend.onrender.com/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          setGameState(data);
          callback?.(data);
        })
        .catch(err => console.error(`${endpoint} error:`, err));
    },
    [setGameState]
  );

  const handlePlant = useCallback((type: 'mushroom' | 'flower' | 'herb', index: number) => {
    postToBackend("plant", { type, index });
  }, [gameState, postToBackend]);

  const handleHarvest = useCallback(() => {
    postToBackend("harvest", gameState);
  }, [gameState, postToBackend]);

  const handleBrew = useCallback(() => {
    postToBackend("brew", gameState);
  }, [gameState, postToBackend]);

  const handleFulfill = useCallback((card: TownRequestCard) => {
    postToBackend("fulfill", { card });
  }, [gameState, postToBackend]);

  const handlePlantTree = useCallback((index: number) => {
    postToBackend("plant-tree", { plotIndex: index });
  }, [gameState, postToBackend]);

  const handleFellTree = useCallback((index: number) => {
    postToBackend("fell-tree", { index });
  }, [gameState, postToBackend]);

  const handleBuy = (type: PotionType) => {
    postToBackend("buy", { type });
  };
  
  const handleSell = (type: PotionType) => {
    postToBackend("sell", { type });
  };  

  const handleUpgrade = useCallback(() => {
    postToBackend("upgrade", gameState);
  }, [gameState, postToBackend]);

  const handleAdvanceTurn = useCallback(() => {
    postToBackend("advance", gameState, (data) => {
      const result = calculateScore(data.player);
      if (result.lost) {
        setGameOver(true);
        setScoreData(result);
      }
    });
  }, [gameState, postToBackend, setGameOver, setScoreData]);

  return (
    <div className="p-4 space-y-4 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 min-h-screen">
      <GameStatusBar status={gameState?.status} />

      {gameState?.player?.alerts?.length ? (
        <div className="bg-white border border-indigo-200 p-4 rounded shadow-md text-sm text-gray-800 space-y-1">
          {gameState.player.alerts.map((alert, i) => (
            <div key={i}>🔔 {alert}</div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-row gap-6 items-start">
        <div className="flex flex-col gap-4 w-1/2">
          <GardenGrid
            spaces={gameState.player.garden.spaces}
            onPlantCrop={handlePlant}
            onPlantTree={handlePlantTree}
            player={gameState.player}
          />
          <InventoryBox player={gameState.player} />
          <UpgradeShop upgrades={gameState.player.upgrades} onUpgrade={handleUpgrade} />
        </div>

        <div className="flex flex-col gap-4 w-1/2">
          <TownRequests cards={gameState.townRequests} onFulfill={handleFulfill} />
          {gameState?.market && (
            <MarketView market={gameState.market} onBuy={handleBuy} onSell={handleSell} />
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