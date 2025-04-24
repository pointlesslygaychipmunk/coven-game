import React, { useEffect } from "react";
import { GardenGrid } from "./GardenGrid";
import { InventoryBox } from "./InventoryBox";
import { UpgradeShop } from "./UpgradeShop";
import { GameStatusBar } from "./GameStatusBar";
import { TownRequests } from "./TownRequests";
import type { TownRequestCard } from "./TownRequests";
import { MarketView } from "./MarketView";
import { GameOver } from "./GameOver";
import { calculateScore } from "../../../shared/scoreLogic";
import type { Player, GameStatus, GameState } from "../../../shared/types";
import { postUpdate } from "../utils";

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

  const handlePlantCrop = (itemType: 'mushroom' | 'flower' | 'herb' | 'fruit', plotIndex: number) => {
    postUpdate("play-turn", {
      gameState: {
        ...gameState,
        player: {
          ...gameState.player,
          actions: [
            {
              type: "plant",
              itemType,
              plotIndex
            }
          ]
        }
      }
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

  const postUpdate = (path: string, payload: any) => {
    fetch(`https://api.telecrypt.xyz/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error(`${path} error:`, err));
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

      <div className="flex flex-row gap-6 items-start">
        <div className="flex flex-col gap-4 w-1/2">
          <GardenGrid
            spaces={gameState.player.garden.spaces}
            player={gameState.player}
            onPlantCrop={handlePlantCrop}
            onPlantTree={() => {}} // Placeholder
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