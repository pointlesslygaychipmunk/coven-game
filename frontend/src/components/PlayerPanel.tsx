import React from 'react';
import { Player } from '..types/../../shared/types';

export const PlayerPanel = ({ player }: { player: Player }) => {
  return (
    <div className="p-4 bg-white/10 rounded-xl shadow-md text-left space-y-2">
      <h2 className="text-xl font-bold">{player.name}</h2>
      <div>Gold: {player.gold}</div>
      <div>Craft Points: {player.craftPoints}</div>
      <div>Renown: {player.renown}</div>
      <div>Mana: {player.mana}</div>
      <div>Well: {4 + player.upgrades.well * 2} water</div>
      <div>Cellar Capacity: {8 + player.upgrades.cellar * 4}</div>
    </div>
  );
};
