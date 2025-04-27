/* src/components/GardenGrid.tsx */
import type { Tile } from "@shared/types";
import { cn } from "@ui/utils";

interface Props { tiles: Tile[][] }

export default function GardenGrid({ tiles }: Props) {
  return (
    <section
      style={{
        gridTemplateColumns: `repeat(${tiles[0]?.length ?? 0}, minmax(2.5rem,1fr))`,
      }}
      className="grid gap-px rounded-lg bg-layer-3 p-px"
    >
      {tiles.flatMap((row, y) =>
        row.map((tile, x) => (
          <div
            key={`${x}-${y}`}
            className={cn(
              "aspect-square bg-layer-2 transition-colors",
              tile.crop && "animate-in fade-in zoom-in bg-green-700/70",
            )}
            title={tile.crop ?? "Empty"}
          />
        )),
      )}
    </section>
  );
}