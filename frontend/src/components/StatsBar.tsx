import React from "react";
import type { Player, GameStatus } from "../../../shared/types";

export interface StatsBarProps {
  player: Player;
  status: GameStatus;
}

const StatsBar: React.FC<StatsBarProps> = ({ player, status }) => {
  const { gold, renown, craftPoints, mana } = player;
  const { year, season, moonPhase, weather } = status;

  return (
    <div className="bg-purple-100 rounded-lg p-4 flex justify-between items-center ring-1 ring-purple-200">
      <div>📅 Year {year}, {season}</div>
      <div>🌙 Phase {moonPhase}</div>
      <div>☀️ {weather}</div>
      <div className="space-x-4">
        <span>💰{gold}</span>
        <span>✨{renown}</span>
        <span>🔧{craftPoints}</span>
        <span>💧{mana}</span>
      </div>
    </div>
  );
};

export default StatsBar;