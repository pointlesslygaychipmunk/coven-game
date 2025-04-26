import React from "react";
import type { GardenSlot, CropType } from "../../../shared/types";

interface GardenGridProps {
  spaces: GardenSlot[];
  onPlantCrop: (crop: CropType, index: number) => void;
  onWater:      (index: number) => void;
  onHarvest:    (index: number) => void;
  onPlantTree:  (index: number) => void;
}

const EMOJI: Record<CropType, string> = {
  mushroom: "🍄",
  flower:   "🌸",
  herb:     "🌿",
  fruit:    "🍎",
};

const GardenGrid: React.FC<GardenGridProps> = ({
  spaces,
  onPlantCrop,
  onWater,
  onHarvest,
  onPlantTree,
}) => (
  <div className="grid grid-cols-4 gap-4">
    {spaces.map((slot, idx) => {
      const empty  = slot.growth === 0 && !slot.isDead;
      const dead   = slot.isDead;
      const mature = slot.growth >= 3 && !dead;

      let bg = "bg-green-100";
      if (dead)        bg = "bg-gray-200";
      else if (!empty) bg = "bg-yellow-100";

      return (
        <div
          key={idx}
          className={`relative h-32 rounded-lg ${bg} ring-1 ring-purple-200 flex flex-col items-center justify-center`}
        >
          <span className="text-2xl">
            {dead ? "💀" : empty ? "🌱" : mature ? EMOJI[slot.type] : EMOJI[slot.type]}
          </span>
          <span className="italic text-sm capitalize mt-1 text-purple-800">
            {dead ? "dead" : empty ? "empty" : slot.type}
          </span>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 rounded-lg space-x-2 transition-opacity">
            {empty && (
              (Object.keys(EMOJI) as CropType[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onPlantCrop(c, idx)}
                  className="p-1 bg-white rounded-full shadow hover:bg-white/80"
                  title={`Plant ${c}`}
                >
                  {EMOJI[c]}
                </button>
              ))
            )}

            {!empty && !dead && (
              <>
                <button
                  onClick={() => onHarvest(idx)}
                  className="p-1 bg-white rounded-full shadow hover:bg-white/80"
                  title="Harvest"
                >🌾</button>
                <button
                  onClick={() => onWater(idx)}
                  className="p-1 bg-white rounded-full shadow hover:bg-white/80"
                  title="Water"
                >💧</button>
                {mature && (
                  <button
                    onClick={() => onPlantTree(idx)}
                    className="p-1 bg-white rounded-full shadow hover:bg-white/80"
                    title="Grow Tree"
                  >🌳</button>
                )}
              </>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

export default GardenGrid;