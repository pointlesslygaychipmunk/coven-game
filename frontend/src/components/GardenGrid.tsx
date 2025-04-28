import clsx from "@ui/utils/clsx";
import type {
  Tile,                 /* alias for GardenSlot in @shared/types        */
  CropType,
  GameAction as Action,
} from "@shared/types";

interface Props {
  tiles:      Tile[];                         // 1-D array from server
  inventory:  Record<CropType, number>;
  onAction:   (a: Action) => void;
}

export function GardenGrid({ tiles, inventory, onAction }: Props) {
  return (
    <div
      /* 9×4 grid – adjust as you like */
      className="grid grid-cols-9 gap-1 select-none"
      style={{ maxWidth: "min-content" }}
    >
      {tiles.map((tile, i) => {
        const crop = tile.crop as CropType | null;         // TS satisfied
        const growth = tile.growth;

        return (
          <button
            key={i}
            onClick={() =>
              crop
                ? onAction({ type: "harvest", index: i })
                : onAction({ type: "plant", crop: "mushroom", index: i })
            }
            className={clsx(
              "w-12 h-12 rounded-sm border border-stone-700/60 text-xs",
              crop && "bg-green-700/70 animate-in fade-in zoom-in"
            )}
            title={
              crop
                ? `${crop} – ${Math.round(growth * 100)} %`
                : "Empty soil"
            }
          >
            {crop ? Math.round(growth * 100) + "%" : ""}
          </button>
        );
      })}
    </div>
  );
}
