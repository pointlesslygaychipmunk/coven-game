import React from 'react';
import type { GardenSlot, Player } from '../../../shared/types';

const validCropTypes = ['mushroom', 'flower', 'herb'] as const;
type CropType = (typeof validCropTypes)[number];

const growthIcons: Record<string, string[]> = {
  mushroom: ['🟤', '🍄', '🍄🍄', '🍄🍄🍄'],
  flower:   ['🌱', '🪷', '🌸', '🪻'],
  herb:     ['🌱', '☘️', '🍀', '🌾'],
  fruit:    ['🌱', '🌿', '🌳', '🌳'],
};

interface GardenGridProps {
  spaces: (GardenSlot | null)[];
  player: Player;
  onPlantCrop: (type: CropType, index: number) => void;
  onPlantTree: (index: number) => void;
  onWater: (index: number) => void;
  onHarvest: (index: number) => void;
}

export function GardenGrid({
  spaces, player, onPlantCrop, onPlantTree, onWater, onHarvest
}: GardenGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {spaces.map((slot, idx) =>
        slot ? renderSlot(slot, idx) : renderEmpty(idx)
      )}
    </div>
  );

  function renderEmpty(index: number) {
    return (
      <div key={index} className="border-2 border-dashed border-green-300 bg-white/40 rounded-lg p-2 text-center space-y-1 shadow-sm">
        {validCropTypes.map((type) => (
          <button
            key={type}
            className="w-full py-1 bg-green-100 hover:bg-green-200 rounded font-medium transition disabled:opacity-50"
            disabled={player.inventory[type] <= 0}
            onClick={() => onPlantCrop(type, index)}
          >
            🌱 {type}
          </button>
        ))}
        <button
          className="w-full py-1 bg-yellow-100 hover:bg-yellow-200 rounded font-medium transition disabled:opacity-50"
          disabled={player.inventory.fruit <= 0}
          onClick={() => onPlantTree(index)}
        >
          🌳 Tree
        </button>
      </div>
    );
  }

  function renderSlot(slot: GardenSlot, index: number) {
    const { type, growth, isDead, kind } = slot;
    const stage = Math.min(Math.floor(growth), 3);
    const isTree = kind === 'tree';
    const icon = isDead
      ? '💀'
      : isTree
      ? '🌳'
      : growthIcons[type]?.[stage] ?? '❓';
    const liveClass = isDead
      ? 'bg-gray-200 text-gray-600 line-through'
      : isTree
      ? 'bg-green-200 text-green-900'
      : 'bg-lime-100 text-lime-800';

    return (
      <div key={index} className={`rounded-lg p-2 text-center shadow-md transition ${liveClass}`}>
        <div className="text-2xl">{icon}</div>
        <div className="text-xs font-semibold">{type}</div>
        <div className="flex justify-around mt-2 space-x-1 text-sm">
          {!isDead ? (
            <>
              <button onClick={() => onHarvest(index)} className="px-1 py-0.5 bg-red-200 hover:bg-red-300 rounded">🚜</button>
              <button onClick={() => onWater(index)}   className="px-1 py-0.5 bg-blue-200 hover:bg-blue-300 rounded">💧</button>
            </>
          ) : (
            <button onClick={() => onHarvest(index)} className="px-1 py-0.5 bg-gray-300 hover:bg-gray-400 rounded">🧹</button>
          )}
        </div>
      </div>
    );
  }
}
