import React from "react";
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
import type { Player } from "../../../shared/types";

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
    setGameState((prev: any) => plantCrop(prev, type, index));
  };

  const handleHarvest = () => {
    const indexes: number[] = []; // Replace with actual crop indexes
    setGameState((prev: any) => harvestCrop(prev, indexes));
  };

  const handleBrew = () => {
    const potionMap: Record<'mushroom' | 'flower' | 'herb' | 'fruit', number> = {
      mushroom: 1,
      flower: 1,
      herb: 1,
      fruit: 1,
    }; // Replace with real data
    setGameState((prev: any) => brewPotions(prev, potionMap));
  };

  const handleFulfill = (card: TownRequestCard) => {
    setGameState((prev: any) => fulfillTownRequest(prev, card));
  };

  const handlePlantTree = () => {
    const plotIndex = 0; // Replace with selected plot
    setGameState((prev: any) => plantTree(prev, plotIndex));
  };

  const handleFellTree = (index: number) => {
    setGameState((prev: any) => fellTree(prev, index));
  };

  const handleBuy = () => {
    // logic here
  };

  const handleSell = () => {
    // logic here
  };

  const handleUpgrade = () => {
    // logic here
  };

  const handleAdvanceTurn = () => {
    const result = advanceTurn(gameState);
    setGameState(result.state);
    if (result.gameOver) {
      setGameOver(true);
      setScoreData(calculateScore(result.state));
    }
  };

  return (
    <div className="p-4 space-y-4 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 min-h-screen">
      <GameStatusBar status={gameState.status} />

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