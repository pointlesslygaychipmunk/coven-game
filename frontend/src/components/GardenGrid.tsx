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
              key={x}
              className={cn(
                "w-8 h-8 border border-stone-700 relative grid place-items-center",
                /* ▼ only a **string** (or undefined) ever reaches `cn`  */
                tile.crop ? "animate-in fade-in zoom-in bg-green-700/70" : undefined
              )}
            >
              {/* render crop glyph, growth, etc. */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}