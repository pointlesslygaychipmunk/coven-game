// frontend/src/components/StatsBar.tsx
import React from 'react';
import type { Player } from '../../../shared/types';

interface StatsBarProps {
  player: Player;
}

export const StatsBar: React.FC<StatsBarProps> = ({ player }) => (
  <div className="flex gap-6 mb-4 text-sm">
    <div className="flex items-center gap-1">💰 {player.gold}</div>
    <div className="flex items-center gap-1">🔮 {player.mana}</div>
    <div className="flex items-center gap-1">⭐ {player.renown}</div>
    <div className="flex items-center gap-1">🛠️ {player.craftPoints}</div>
  </div>
);
