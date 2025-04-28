import React from "react";
import type { GameState } from "@shared/types";
import GardenGrid from "./GardenGrid";

interface GameViewProps {
  state: GameState;
  dispatch: (action: any) => void;
}

const GameView: React.FC<GameViewProps> = ({ state, dispatch }) => {
  const currentPlayer = state.players[state.currentPlayer ?? 0] ?? state.players[0];

  return (
    <div>
      <GardenGrid garden={currentPlayer.garden} />
    </div>
  );
};

export default GameView;
