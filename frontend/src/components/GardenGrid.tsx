import clsx from '@ui/utils/clsx';
import type { Tile, CropType, Action } from '@shared/types';

export interface Props {
  tiles    : Tile[][];
  inventory: Record<CropType, number>;
  onAction : (a: Action) => void;
}

export default function GardenGrid({ tiles, inventory, onAction }: Props) {
  return (
    <div className="grid gap-1"
         style={{ gridTemplateColumns:`repeat(${tiles[0].length},3rem)` }}>
      {tiles.flatMap((row,y)=>
        row.map((tile,x)=>{
          const crop = tile.crop as CropType | null;   // satisfy TS
          const key  = `${x}-${y}`;

          return (
            <button key={key}
                    className={clsx(
                      'w-12 h-12 rounded border border-stone-700/60',
                      crop && 'animate-in fade-in zoom-in ' + cropColour(crop),
                      tile.watered && 'ring-2 ring-sky-500/60',
                      tile.dead && 'grayscale opacity-50'
                    )}
                    onClick={()=> harvestable(tile) &&
                      onAction({ type:'harvest', index: y*row.length+x })}>
              {cropEmoji(crop)}
            </button>
          );
      })) }
    </div>
  );
}

/* ───────── helpers ───────── */

const cropColour = (c:CropType)=>({
  mushroom:'bg-rose-700/60',
  flower  :'bg-pink-600/50',
  herb    :'bg-green-700/70',
  fruit   :'bg-orange-600/60',
}[c!]);

const cropEmoji = (c:CropType|null)=>({
  mushroom:'🍄', flower:'🌼', herb:'🌿', fruit:'🍊',
}[c as CropType] ?? ' ');

const harvestable = (t:Tile)=> !!t.crop && t.growth>=1 && !t.dead;