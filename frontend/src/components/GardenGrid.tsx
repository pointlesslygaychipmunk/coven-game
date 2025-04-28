// frontend/src/components/GardenGrid.tsx – Interactive garden grid (plant/harvest/water)
import React from 'react';
import clsx from 'clsx';
import type { Tile, CropType, Action } from '@shared/types';

interface GardenGridProps {
  tiles: Tile[];
  inventory: Record<CropType, number>;
  onAction: (action: Action) => void;
}

const GardenGrid: React.FC<GardenGridProps> = ({ tiles, inventory, onAction }) => {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(8, 40px)', gridAutoRows: '40px' }}>
      {tiles.map((tile, i) => {
        const crop = tile.crop as CropType | null;
        const isDead = tile.dead;
        return (
          <button
            key={i}
            onClick={() => {
              if (crop) {
                // Harvest if a crop is present
                onAction({ type: 'harvest', index: i });
              } else {
                // Plant using the first available seed type from inventory
                const seedType = (Object.keys(inventory) as CropType[]).find(ct => (inventory[ct] ?? 0) > 0);
                if (seedType) {
                  onAction({ type: 'plant', crop: seedType, index: i });
                }
              }
            }}
            onDoubleClick={() => {
              // Double-click to water a living crop
              if (crop && !isDead) {
                onAction({ type: 'water', index: i });
              }
            }}
            className={clsx(
              'w-10 h-10 rounded border text-xs font-bold',
              crop ? 'bg-emerald-700/80 hover:bg-emerald-600' : 'bg-stone-700/50 hover:bg-stone-600',
              isDead && 'bg-stone-500 line-through'
            )}
          >
            {crop ? crop.charAt(0).toUpperCase() : ''}
          </button>
        );
      })}
    </div>
  );
};

export default GardenGrid;
