import React, { useEffect } from "react";
import { GardenGrid } from "./GardenGrid";
import { InventoryBox } from "./InventoryBox";
import { GameStatusBar } from "./GameStatusBar";
import { TownRequests } from "./TownRequests";
import { Market } from "./Market";
import { GameOver } from "./GameOver";
import { Journal } from "./Journal";
import type { GameState } from "../../../shared/types";
import { postUpdate } from "../utils"; // or wherever your util resides

interface LayoutProps {
  gameState: GameState;
  setGameState: (val: GameState) => void;
  gameOver: boolean;
  setGameOver: (val: boolean) => void;
  scoreData: any;
  setScoreData: (val: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  gameState,
  setGameState,
  gameOver,
  setGameOver,
  scoreData,
  setScoreData,
}) => {
  useEffect(() => {
    postUpdate("init", {}, setGameState);
  }, [setGameState]);

  const handlePlantCrop = (crop: "mushroom" | "flower" | "herb", index: number) => {
    postUpdate("execute-actions", { actions: [{ type: "plant", crop, index }] }, setGameState);
  };

  const handlePlantTree = (index: number) => {
    postUpdate("execute-actions", { actions: [{ type: "plant", crop: "fruit", index }] }, setGameState);
  };

  const handleHarvest = (index: number) => {
    postUpdate("execute-actions", { actions: [{ type: "harvest", index }] }, setGameState);
  };

  const handleFulfill = (requestId: string) => {
    postUpdate("execute-actions", { actions: [{ type: "fulfill", requestId }] }, setGameState);
  };

  const handleAdvanceTurn = () => {
    postUpdate("play-turn", {}, setGameState);
  };

  if (!gameState.players.length) {
    return <div>Loading game...</div>;
  }
  const player = gameState.players[0];

  if (gameOver && scoreData) {
    return <GameOver score={scoreData.total} breakdown={scoreData.breakdown} lost={scoreData.lost} />;
  }

  return (
    <div className="p-4 space-y-4 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 min-h-screen">
      <GameStatusBar status={gameState.status} />

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
          <TownRequests cards={gameState.townRequests} onFulfill={handleFulfill} />

          <Market
            marketItems={gameState.market.items}
            onBuy={(key) => postUpdate("execute-actions", { actions: [{ type: "buy", itemId: key, quantity: 1 }] }, setGameState)}
            onSell={(key) => postUpdate("execute-actions", { actions: [{ type: "sell", itemId: key, quantity: 1 }] }, setGameState)}
            onAcquireBlack={(key) => postUpdate("execute-actions", { actions: [{ type: "buy", itemId: key, quantity: 1 }] }, setGameState)}
          />
        </div>
      </div>

      <button
        className="mt-4 px-6 py-3 bg-pink-300 hover:bg-pink-400 text-white font-bold rounded-full"
        onClick={handleAdvanceTurn}
      >
        🌙 End Turn
      </button>

      <Journal alerts={gameState.journal} />
    </div>
  );
};