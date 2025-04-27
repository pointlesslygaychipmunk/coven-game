import { memo } from "react";
import type { Tile } from "@shared/types";

interface Props {
  tiles: Tile[][];
}

function Grid({ tiles }: Props) {
  return (
    <div
      className="grid gap-1 p-2"
      style={{ gridTemplateColumns: `repeat(${tiles[0].length}, 1fr)` }}
    >
      {tiles.flat().map(t => (
        <div
          key={t.id}
          className="aspect-square rounded bg-emerald-100/40 ring-1 ring-emerald-400/40"
        >
          {/* TODO: render crop sprite, growth state, etc. */}
        </div>
      ))}
    </div>
  );
}

export const GardenGrid = memo(Grid);