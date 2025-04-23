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

  if (!gameState || !gameState.player) {
    return <div className="p-4 text-red-700">Loading game data...</div>;
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
    };
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
    <div className="p-4">
      {gameState.status && (
        <GameStatusBar status={gameState.status} />
      )}

      <section className="my-4">
        <GardenGrid
          spaces={gameState.player.garden.spaces}
          onPlantCrop={handlePlant}
          onPlantTree={handlePlantTree}
          player={gameState.player}
        />
      </section>

      <section className="my-4">
        <InventoryBox player={gameState.player} />
      </section>

      <section className="my-4">
        <UpgradeShop upgrades={gameState.player.upgrades} onUpgrade={handleUpgrade} />
      </section>

      <section className="my-4">
        <TownRequests cards={gameState.townRequests} onFulfill={handleFulfill} />
      </section>

      <section className="my-4">
        {gameState.market && (
          <MarketView
            market={gameState.market}
            onBuy={handleBuy}
            onSell={handleSell}
          />
        )}
      </section>

      <button
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        onClick={handleAdvanceTurn}
      >
        🌙 End Turn / Advance Moon
      </button>
    </div>
  );
};