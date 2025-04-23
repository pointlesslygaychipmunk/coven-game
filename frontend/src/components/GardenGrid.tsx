import React, { useState } from 'react';
import { CropPlot, TreePlot, Player } from '../../../shared/types';

type GardenSlot = CropPlot | TreePlot | null;

export const GardenGrid = ({
  spaces,
  selectable = false,
  selected = [],
  toggleSelect = () => {},
  onPlantCrop,
  onPlantTree,
  player
}: {
  spaces: GardenSlot[];
  selectable?: boolean;
  selected?: number[];
  toggleSelect?: (index: number) => void;
  onPlantCrop: (type: 'mushroom' | 'flower' | 'herb', index: number) => void;
  onPlantTree: (index: number) => void;
  player: Player;
}) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleDropdown = (i: number) => {
    setActiveDropdown(activeDropdown === i ? null : i);
  };

  const renderSlot = (slot: GardenSlot, i: number) => {
    const isSelected = selected.includes(i);
    const baseStyle = "rounded-lg h-24 flex items-center justify-center shadow-inner relative";

    if (!slot) {
      return (
        <div key={i} className="bg-stone-100 text-gray-400 text-sm text-center p-2 border border-dashed relative">
          {selectable && (
            <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(i)} className="absolute top-1 left-1" />
          )}
          <button
            onClick={() => handleDropdown(i)}
            className="text-xs px-2 py-1 bg-white border rounded shadow hover:bg-stone-50"
          >
            🌱 Plant
          </button>
          {activeDropdown === i && (
            <div className="absolute top-10 left-2 z-10 bg-white border border-stone-300 rounded shadow text-left text-xs w-28 p-1 space-y-1">
              {(['herb', 'flower', 'mushroom'] as const).map(crop =>
                player.inventory[crop + 's'] > 0 ? (
                  <button key={crop} className="block w-full text-left hover:bg-stone-100 px-1 py-0.5"
                    onClick={() => { onPlantCrop(crop, i); setActiveDropdown(null); }}>
                    🌸 Plant {crop}
                  </button>
                ) : null
              )}
              <button
                onClick={() => { onPlantTree(i); setActiveDropdown(null); }}
                className="block w-full text-left hover:bg-stone-100 px-1 py-0.5"
              >
                🌳 Plant Tree
              </button>
              <button
                onClick={() => setActiveDropdown(null)}
                className="block w-full text-left text-gray-400 hover:text-black hover:bg-stone-100 px-1 py-0.5"
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      );
    }

    if ('type' in slot) {
      const icons = {
        mushroom: '🍄',
        flower: '🌸',
        herb: '🌿',
      };
      const maxGrowth = { mushroom: 4, flower: 3, herb: 2 }[slot.type];
      const bg = {
        mushroom: 'bg-amber-100',
        flower: 'bg-pink-100',
        herb: 'bg-green-100',
      }[slot.type];

      return (
        <div
          key={i}
          className={`${bg} ${baseStyle}`}
          title={`${slot.type} (${slot.growth}/${maxGrowth})`}
        >
          {selectable && (
            <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(i)} className="absolute top-1 left-1" />
          )}
          <div className="flex flex-col items-center">
            <span className="text-2xl">{slot.isDead ? '☠️' : icons[slot.type]}</span>
            <span className="text-xs">{slot.growth}/{maxGrowth}</span>
          </div>
        </div>
      );
    }

    return (
      <div key={i} className={`bg-emerald-100 ${baseStyle}`} title={`Tree (${slot.growth}/4)`}>
        {selectable && (
          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(i)} className="absolute top-1 left-1" />
        )}
        <div className="flex flex-col items-center">
          <span className="text-2xl">{slot.isDead ? '☠️' : '🌳'}</span>
          <span className="text-xs">{slot.growth}/4</span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-4 gap-2 p-2 rounded-lg border border-emerald-200 bg-white/60">
      {spaces.map((_, i) => renderSlot(spaces[i], i))}
    </div>
  );
};
