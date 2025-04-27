// src/components/GardenGrid.tsx
import { Tile } from "@shared/types";
import cn from "@ui/utils";

interface Props {
  tiles: Tile[][];
}

export default function GardenGrid({ tiles }: Props) {
  return (
    <div className="grid gap-1">
      {tiles.map((row, y) => (
        <div key={y} className="flex gap-1">
          {row.map((tile, x) => (
            <div
            key={i}
            className={cn(
              "w-8 h-8 border border-stone-700",
              tile.crop && "animate-in fade-in zoom-in bg-green-700/70"
            )}
          >
            {/* … */}
          </div>
              {/* render crop glyph, growth, etc. */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}