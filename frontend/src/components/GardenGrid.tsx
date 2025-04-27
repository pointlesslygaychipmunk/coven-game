// frontend/src/components/GardenGrid.tsx
import React, { memo } from 'react';
import cn from 'classnames';
import type { Tile } from '@shared/types';

interface Props {
  /** 2-D array coming straight from window.game.tiles */
  tiles: Tile[][];
}

const GardenGrid: React.FC<Props> = ({ tiles }) => (
  <div
    className="grid gap-1 p-2"
    style={{
      /** use the width of the first row to set the column repeat */
      gridTemplateColumns: `repeat(${tiles[0]?.length ?? 0}, minmax(0,1fr))`,
    }}
  >
    {tiles.flat().map((t) => (
      <div
        key={t.id}
        className={cn(
          'aspect-square rounded-md transition-transform duration-150',
          'flex items-center justify-center text-xs font-semibold',
          t.crop
            ? 'bg-emerald-500/20 border border-emerald-600/30'
            : 'bg-mauve-200/30',
          'hover:-translate-y-1 hover:shadow-lg'
        )}
      >
        {t.crop ?? '—'}
      </div>
    ))}
  </div>
);

export default memo(GardenGrid);