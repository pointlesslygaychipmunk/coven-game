// frontend/src/components/StatsBar.tsx – Game status and player stats bar
import React from 'react';
import type { Player, GameStatus } from '@shared/types';

interface StatsBarProps {
  player: Player;
  status: GameStatus;
  onAdvanceTurn: () => void;
}

const StatsBar: React.FC<StatsBarProps> = ({ player, status, onAdvanceTurn }) => {
  const moonIcons = ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
  const moonIcon = moonIcons[status.moonPhase] ?? '🌙';
  return (
    <div className="flex items-center justify-between bg-stone-800/80 text-stone-200 px-4 py-2 rounded border border-stone-700">
      <div className="text-sm">
        📅 Year {status.year}, {status.season.charAt(0).toUpperCase() + status.season.slice(1)} – {moonIcon} Phase {status.moonPhase} – 🌦️ {status.weather}
      </div>
      <div className="text-sm flex items-center gap-4">
        <span>💰 Gold: {player.gold}</span>
        <span>⭐ Renown: {player.renown}</span>
        <span>🔮 Mana: {player.mana}</span>
        <button onClick={onAdvanceTurn} className="ml-4 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-xs">
          End Turn
        </button>
      </div>
    </div>
  );
};

export default StatsBar;
