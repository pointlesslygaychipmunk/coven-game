import React from 'react';
import type { Player, GameStatus } from '../../../shared/src/types';

export interface StatsBarProps {
  player: Player;
  status: GameStatus;
}

const StatsBar: React.FC<StatsBarProps> = ({ player, status }) => {
  const { gold, renown, craftPoints, mana } = player;
  const { year, season, moonPhase, weather } = status;

  return (
    <div className="bg-purple-100 rounded-lg p-4 flex justify-between items-center ring-1 ring-purple-200 shadow-sm">
      <div className="font-medium">📅 Year {year}, {season}</div>
      <div className="font-medium">🌙 Phase {moonPhase}</div>
      <div className="font-medium">☀️ {weather}</div>
      <div className="flex gap-4">
        <span>💰 {gold}</span>
        <span>✨ {renown}</span>
        <span>🔧 {craftPoints}</span>
        <span>💧 {mana}</span>
      </div>
    </div>
  );
};

export default StatsBar;