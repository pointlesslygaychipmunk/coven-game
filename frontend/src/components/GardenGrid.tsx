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
      className="grid gap-1 fade-in-spell"
      style={{ gridTemplateColumns: "repeat(8,40px)", gridAutoRows: "40px" }}
    >
      {tiles.map((tile, i) => {
        const crop = tile.crop as CropType | null;
        return (
          <button
            key={i}
            onClick={() =>
              crop
                ? onAction({ type: "harvest", index: i })
                : onAction({ type: "plant", crop: "mushroom", index: i })
            }
            className={clsx(
              "w-10 h-10 rounded-md border ethereal-border text-xs font-bold text-white transition-all",
              crop && "bg-emerald-700/80 hover:bg-emerald-600",
              tile.dead && "bg-stone-600/80 hover:bg-stone-500"
            )}
          >
            {crop?.[0]?.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
