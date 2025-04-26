import React, { useEffect } from "react";
import { GardenGrid } from "./GardenGrid";
import { InventoryBox } from "./InventoryBox";
import { GameStatusBar } from "./GameStatusBar";
import { TownRequests } from "./TownRequests";
import { Market } from "./Market";
import { GameOver } from "./GameOver";
import { Journal } from "./Journal";
import { MarketMemory } from "./MarketMemory";

import type { GameState, Action } from "../../../shared/types";
import {
  fetchState,
  executeActions,
  advanceTurn,
} from "../utils"; // adjust path if needed

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
  // On mount, pull initial state
  useEffect(() => {
    fetchState()
      .then(setGameState)
      .catch((err) => console.error("fetch state error:", err));
  }, [setGameState]);

  // Helpers wrapping our utils
  const handlePlantCrop = (crop: "mushroom" | "flower" | "herb", index: number) => {
    executeActions(gameState.players[0].id, [{ type: "plant", crop, index }])
      .then(setGameState)
      .catch((e) => console.error(e));
  };

  const handlePlantTree = (index: number) => {
    executeActions(gameState.players[0].id, [{ type: "plant", crop: "fruit", index }])
      .then(setGameState)
      .catch((e) => console.error(e));
  };

  const handleHarvest = (index: number) => {
    executeActions(gameState.players[0].id, [{ type: "harvest", index }])
      .then(setGameState)
      .catch((e) => console.error(e));
  };

  const handleFulfill = (requestId: string) => {
    executeActions(gameState.players[0].id, [{ type: "fulfill", requestId }])
      .then(setGameState)
      .catch((e) => console.error(e));
  };

  const handleAdvanceTurn = () => {
    advanceTurn()
      .then(setGameState)
      .catch((e) => console.error(e));
  };

  if (!gameState.players.length) return <div>Loading game...</div>;
  const player = gameState.players[0];

  if (gameOver && scoreData) {
    return <GameOver score={scoreData.total} breakdown={scoreData.breakdown} lost={scoreData.lost} />;
  }

  return (
    <div className="p-4 space-y-4">
      <GameStatusBar status={gameState.status} />

      <div className="flex gap-6">
        <div className="w-1/2 space-y-4">
          <GardenGrid
            spaces={player.garden}
            player={player}
            onPlantCrop={handlePlantCrop}
            onPlantTree={handlePlantTree}
            onHarvest={handleHarvest}
          />
          <InventoryBox player={player} />
        </div>

        <div className="w-1/2 space-y-4">
          <TownRequests cards={gameState.townRequests} onFulfill={handleFulfill} />
          <Market
            marketItems={gameState.market.items}
            onBuy={(id) => executeActions(player.id, [{ type: "buy", itemId: id, quantity: 1 }]).then(setGameState)}
            onSell={(id) => executeActions(player.id, [{ type: "sell", itemId: id, quantity: 1 }]).then(setGameState)}
            onAcquireBlack={(id) => executeActions(player.id, [{ type: "buy", itemId: id, quantity: 1 }]).then(setGameState)}
          />
        </div>
      </div>

      <button
        onClick={handleAdvanceTurn}
        className="mt-4 px-6 py-3 bg-pink-300 hover:bg-pink-400 text-white rounded-full"
      >
        🌙 End Turn
      </button>

      <Journal alerts={gameState.journal} />
      <MarketMemory entries={player.memory ?? []} />
    </div>
  );
};