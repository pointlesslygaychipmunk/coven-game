/*  GardenGrid.tsx  —  fully-functional garden renderer & controller
    ───────────────────────────────────────────────────────────────── */

    import { useState, MouseEvent } from "react";
    import { cn } from "@ui/utils";
    import type { Tile, CropType, Action } from "@shared/types";
    
    /* ──────────────────────────────────────────────────────────────────
       Props
       ───────────────────────────────────────────────────────────────── */
    interface Props {
      /** 2-D map of garden slots (null = empty soil) */
      tiles: Tile[][];
    
      /** dispatch up to the top reducer */
      onAction(action: Action): void;
    
      /** player inventory so we can disable planting if 0 */
      inventory: Record<CropType, number>;
    }
    
    /* ──────────────────────────────────────────────────────────────────
       Component
       ───────────────────────────────────────────────────────────────── */
    export default function GardenGrid({ tiles, onAction, inventory }: Props) {
      const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
    
      /* helper renders a single square --------------------------------------- */
      function renderTile(tile: Tile, x: number, y: number) {
        const key = `${x}-${y}`;
        const crop = tile.crop;
        const empty = crop === null;
    
        /* click handler ------------------------------------------------------ */
        function handleClick(e: MouseEvent) {
          e.preventDefault();
    
          if (empty && selectedCrop) {
            // PLANT
            if (inventory[selectedCrop] > 0)
              onAction({ type: "plant", crop: selectedCrop, index: y * tiles[0].length + x });
          } else if (!empty && tile.growth >= 1) {
            // HARVEST
            onAction({ type: "harvest", index: y * tiles[0].length + x });
          } else {
            // WATER
            onAction({ type: "water", index: y * tiles[0].length + x });
          }
        }
    
        return (
          <div
            key={key}
            onClick={handleClick}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded border border-stone-700 text-xs",
              empty      && "bg-stone-800 hover:bg-stone-700",
              crop       && "bg-green-800/70",
              tile.dead  && "bg-red-900/70 line-through"
            )}
          >
            {crop && !tile.dead && (
              <span className="leading-none select-none">
                {crop.slice(0, 1).toUpperCase()}
              </span>
            )}
            {tile.growth < 1 && crop && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-green-500/75"
                    style={{ width: `${tile.growth * 100}%` }} />
            )}
          </div>
        );
      }
    
      /* toolbar ­– choose which crop to plant -------------------------------- */
      function Toolbar() {
        const crops: CropType[] = ["mushroom", "flower", "herb", "fruit"];
    
        return (
          <div className="mb-2 flex gap-2">
            {crops.map(c => (
              <button
                key={c}
                disabled={inventory[c] === 0}
                onClick={() => setSelectedCrop(c)}
                className={cn(
                  "rounded px-2 py-1 text-sm capitalize",
                  selectedCrop === c ? "bg-emerald-600" : "bg-stone-700 hover:bg-stone-600",
                  inventory[c] === 0 && "opacity-40 cursor-not-allowed"
                )}
              >
                {c} ({inventory[c] ?? 0})
              </button>
            ))}
          </div>
        );
      }
    
      /* render grid ----------------------------------------------------------- */
      return (
        <section>
          <Toolbar />
    
          <div className="grid gap-1"
               style={{ gridTemplateColumns: `repeat(${tiles[0].length}, minmax(0,1fr))` }}>
            {tiles.map((row, y) =>
              row.map((tile, x) => renderTile(tile, x, y))
            )}
          </div>
        </section>
      );
    }    