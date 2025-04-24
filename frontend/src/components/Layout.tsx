import React, { useEffect, useState } from "react";
import { GardenGrid } from "./GardenGrid";
import { InventoryBox } from "./InventoryBox";
import { UpgradeShop } from "./UpgradeShop";
import { GameStatusBar } from "./GameStatusBar";
import { TownRequests } from "./TownRequests";
import { MarketView } from "./MarketView";
import { GameOver } from "./GameOver";
import { calculateScore } from "../../../shared/scoreLogic";
import type { Player, GameStatus, GameState } from "../../../shared/types";

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
  const [previousInventory, setPreviousInventory] = useState(gameState.player.inventory);

  useEffect(() => {
    fetch("https://api.telecrypt.xyz/init")
      .then((res) => res.json())
      .then((data) => {
        console.log("🎮 Initial game state loaded:", data);
        setGameState(data);
        setPreviousInventory(data.player.inventory);
      })
      .catch((err) => console.error("Initial load error:", err));
  }, []);

  const postUpdate = (path: string, payload: any) => {
    fetch(`https://api.telecrypt.xyz/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setPreviousInventory(gameState.player.inventory);
        setGameState(data);
      })
      .catch(err => console.error(`${path} error:`, err));
  };

  const handlePlantCrop = (itemType: "mushroom" | "flower" | "herb", plotIndex: number) => {
    postUpdate("play-turn", {
      gameState,
      actions: [{ type: "plant", itemType, plotIndex }]
    });
  };

  const handlePlantTree = (plotIndex: number) => {
    postUpdate("play-turn", {
      gameState,
      actions: [{ type: "plant", itemType: "fruit", plotIndex }]
    });
  };

  const handleHarvest = (plotIndex: number) => {
    postUpdate("play-turn", {
      gameState,
      actions: [{ type: "harvest", plotIndex }]
    });
  };

  const handleUpgrade = (upgradeType: string) => {
    postUpdate("upgrade", { upgradeType, gameState });
  };

  const handleFulfill = (index: number) => {
    fetch("https://api.telecrypt.xyz/fulfill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, gameState })
    })
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error("Fulfill error:", err));
  };

  const handleBuy = (itemType: string) => {
    postUpdate("buy", { itemType, gameState });
  };

  const handleSell = (itemType: string) => {
    postUpdate("sell", { itemType, gameState });
  };

  const handleAdvanceTurn = () => {
    fetch("https://api.telecrypt.xyz/play-turn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameState)
    })
      .then(res => res.json())
      .then(data => {
        setGameState(data);
        const score = calculateScore(data.player);
        setScoreData(score);
        if (score.lost || data.status.renown <= 0 || data.status.potionsBrewed === 0) {
          setGameOver(true);
        }
      })
      .catch(err => console.error("Advance turn error:", err));
  };

  const renderAlerts = () => {
    const alerts = gameState?.player?.alerts ?? [];
    if (alerts.length === 0) return null;
  
    return (
      <div className="bg-red-100 text-red-800 border border-red-300 rounded px-4 py-2 space-y-1 shadow">
        {alerts.map((msg, i) => (
          <div key={i} className="text-sm">{msg}</div>
        ))}
      </div>
    );
  };  

  const renderWaterIndicator = () => {
    const used = gameState.player.garden.spaces.filter(s => s).length;
    const max = gameState.player.upgrades.well * 2 || 1;
    const percent = Math.min((used / max) * 100, 100);
    return (
      <div className="w-full bg-gray-200 rounded h-4 overflow-hidden shadow-inner">
        <div className="h-full bg-blue-400 transition-all" style={{ width: `${percent}%` }}></div>
      </div>
    );
  };

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

      {renderAlerts()}

      <div className="mb-4">
        <label className="block text-xs font-bold text-blue-900 mb-1">Water Usage</label>
        {renderWaterIndicator()}
      </div>

      <div className="flex flex-row gap-6 items-start">
        <div className="flex flex-col gap-4 w-1/2">
          <GardenGrid
            spaces={gameState.player.garden.spaces}
            player={gameState.player}
            onPlantCrop={handlePlantCrop}
            onPlantTree={handlePlantTree}
            onHarvest={handleHarvest}
          />
          <InventoryBox
            player={gameState.player}
            previous={previousInventory}
          />
          <UpgradeShop upgrades={gameState.player.upgrades} onUpgrade={handleUpgrade} />
        </div>

        <div className="flex flex-col gap-4 w-1/2">
          <TownRequests cards={gameState.townRequests} onFulfill={handleFulfill} />
          {gameState?.market && (
            <MarketView
              market={gameState.market}
              onBuy={handleBuy}
              onSell={handleSell}
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