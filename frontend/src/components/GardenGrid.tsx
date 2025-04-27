import { memo } from 'react';
import cn from 'classnames';

interface Tile { id: string; crop?: string; growth: number; }
interface Props { tiles: Tile[] | Tile[][] }

const grid = Array.isArray(tiles[0]) ? tiles as Tile[][] : [tiles as Tile[]];
const GardenGrid = memo(({ tiles }: Props) => (
  <div
    className="grid gap-1 p-2"
    style={{ gridTemplateColumns: 'repeat(10,minmax(0,1fr))' }}
  >
    {tiles.map(t => (
      <div
        key={t.id}
        className={cn(
          'aspect-square rounded-md transition-transform duration-150',
          'flex items-center justify-center text-xs font-semibold',
          t.crop ? 'bg-emerald-500/20 border border-emerald-600/30' : 'bg-mauve-200/30',
          'hover:-translate-y-1 hover:shadow-lg'
        )}
      >
        {t.crop ?? '—'}
      </div>
    ))}
  </div>
));

export default GardenGrid;