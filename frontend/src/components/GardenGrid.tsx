import classNames from '@ui/utils';
import type { Tile, CropType, Action } from '@shared/types';

export interface GardenGridProps {
  tiles:       Tile[][];
  inventory:   Record<CropType, number>;
  onAction:    (a: Action) => void;
}

export default function GardenGrid({
  tiles,
  inventory,
  onAction,
}: GardenGridProps) {
  return (
    <div className="grid grid-cols-8 gap-0.5 select-none">
      {tiles.map((row, y) =>
        row.map((tile, x) => {
          const idx        = y * row.length + x;
          const hasCrop    = tile.type !== null;
          const cropClass  =
            hasCrop && `animate-in fade-in zoom-in bg-green-700/70`;
          const deadClass  = tile.dead && 'opacity-40 grayscale';

          return (
            <button
              key={idx}
              aria-label={hasCrop ? tile.type! : 'empty tile'}
              className={classNames(
                'relative size-12 rounded-sm border border-stone-700/60',
                cropClass,
                deadClass,
              )}
              onClick={() => {
                if (hasCrop) {
                  onAction({ type: 'harvest', index: idx });
                } else {
                  // Plant the first available crop in inventory (demo behaviour)
                  const crop = (Object.keys(inventory) as CropType[])
                    .find(c => inventory[c] > 0);
                  if (crop)
                    onAction({ type: 'plant', crop, index: idx });
                }
              }}
            >
              {hasCrop && (
                <span className="absolute inset-0 grid place-content-center text-xs">
                  {tile.type}
                </span>
              )}
            </button>
          );
        }),
      )}
    </div>
  );
}