import clsx from "@ui/utils/clsx";
import type { Tile, CropType, Action } from "@shared/types";

interface Props {
  tiles: Tile[];
  inventory: Record<CropType, number>;
  onAction(action: Action): void;
}

export default function GardenGrid({ tiles, inventory, onAction }: Props) {
  return (
    <div
      className="grid gap-0.5"
      style={{ gridTemplateColumns: "repeat(8,32px)", gridAutoRows: "32px" }}
    >
      {tiles.map((tile, i) => {
        const crop = tile.crop as CropType | null; // satisfy TS about index type
        return (
          <button
            key={i}
            onClick={() =>
              crop
                ? onAction({ type: "harvest", index: i })
                : onAction({ type: "plant", crop: "mushroom", index: i })
            }
            className={clsx(
              "w-8 h-8 border border-stone-700/50 rounded-sm",
              crop && "animate-in fade-in zoom-in bg-green-700/70",
              tile.dead && "bg-stone-500/70"
            )}
          >
            {crop?.[0]?.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
