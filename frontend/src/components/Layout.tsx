import React, { useEffect } from "react";
import { GardenGrid } from "./GardenGrid";
import { InventoryBox } from "./InventoryBox";
import { UpgradeShop } from "./UpgradeShop";
import { GameStatusBar } from "./GameStatusBar";
import { TownRequests } from "./TownRequests";
import type { TownRequestCard } from "./TownRequests";
import { MarketView } from "./MarketView";
import { GameOver } from "./GameOver";
import { plantCrop, harvestCrop, brewPotions, fulfillTownRequest, plantTree, fellTree } from "../utils";
import { advanceTurn } from "../turnEngine";
import { calculateScore } from "../gameOverLogic";
import type { Player, GameStatus } from "../../../shared/types";

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

  const handlePlant = (type: 'mushroom' | 'flower' | 'herb', index: number) => {
    fetch("https://coven-backend.onrender.com/plant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, index, gameState })
    })
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error("Plant error:", err));
  };

  const handleHarvest = () => {
    fetch("https://coven-backend.onrender.com/harvest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState })
    })
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error("Harvest error:", err));
  };

  const handleBrew = () => {
    fetch("https://coven-backend.onrender.com/brew", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState })
    })
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error("Brew error:", err));
  };

  const handleFulfill = (card: TownRequestCard) => {
    fetch("https://coven-backend.onrender.com/fulfill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card, gameState })
    })
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error("Fulfill error:", err));
  };

  const handlePlantTree = () => {
    fetch("https://coven-backend.onrender.com/plant-tree", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plotIndex: 0, gameState })
    })
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error("Plant tree error:", err));
  };

  const handleFellTree = (index: number) => {
    fetch("https://coven-backend.onrender.com/fell-tree", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, gameState })
    })
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error("Fell tree error:", err));
  };

  const handleBuy = () => {
    fetch("https://coven-backend.onrender.com/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState })
    })
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error("Buy error:", err));
  };

  const handleSell = () => {
    fetch("https://coven-backend.onrender.com/sell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState })
    })
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error("Sell error:", err));
  };

  const handleUpgrade = () => {
    fetch("https://coven-backend.onrender.com/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState })
    })
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error("Upgrade error:", err));
  };

  const handleAdvanceTurn = () => {
    fetch("https://coven-backend.onrender.com/advance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameState })
    })
      .then(res => res.json())
      .then(data => {
        setGameState(data);
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
            onPlantTree={handlePlantTree}
            player={gameState.player}
          />
          <InventoryBox player={gameState.player} />
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