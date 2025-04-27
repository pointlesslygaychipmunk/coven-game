// frontend/src/components/GardenGrid.tsx
import React from "react";
import type { GardenSlot, Player, CropType } from "../../../shared/types";

interface GardenSlotExtra extends GardenSlot {
  isDead?: boolean;
  watered?: boolean;
}

type PlantableCrop = Exclude<CropType, "fruit">;

const plantableTypes: PlantableCrop[] = ["mushroom", "flower", "herb"];

const growthIcons: Record<CropType, string[]> = {
  mushroom: ["🟤", "🍄", "🍄🍄", "🍄🍄🍄"],
  flower:   ["🌱", "🪷", "🌸", "🪻"],
  herb:     ["🌱", "☘️", "🍀", "🌾"],
  fruit:    ["🌱", "🌿", "🌳", "🌳"],  // tree growth progression
};

const harvestThresholds: Record<CropType, number> = {
  mushroom: 4,
  flower:   3,
  herb:     2,
  fruit:    Infinity,
};

interface GardenGridProps {
  spaces: (GardenSlotExtra | null)[];
  player: Player;
  onPlantCrop: (crop: PlantableCrop, index: number) => void;
  onPlantTree: (index: number) => void;
  onWater:     (index: number) => void;
  onHarvest:   (index: number) => void;
}

export const GardenGrid: React.FC<GardenGridProps> = ({
  spaces,
  player,
  onPlantCrop,
  onPlantTree,
  onWater,
  onHarvest,
}) => {
  const renderEmptySlot = (index: number) => (
    <div
      key={index}
      className="border-2 border-dashed border-green-300 bg-white/40 rounded-lg p-2 text-xs space-y-1 text-center shadow-sm"
    >
      {plantableTypes.map((crop) => (
        <button
          key={crop}
          className="bg-green-100 hover:bg-green-200 rounded w-full py-1 font-medium transition disabled:opacity-30"
          disabled={player.inventory[crop] <= 0}
          onClick={() => onPlantCrop(crop, index)}
        >
          🌱 Plant {crop}
        </button>
      ))}
      <button
        className="bg-yellow-100 hover:bg-yellow-200 rounded w-full py-1 font-medium transition disabled:opacity-30"
        disabled={player.inventory["fruit"] <= 0}
        onClick={() => onPlantTree(index)}
      >
        🌳 Plant Tree
      </button>
    </div>
  );

  const renderOccupiedSlot = (slot: GardenSlotExtra, index: number) => {
    const { type, kind, growth, isDead = false, watered = false } = slot;
    const stage = Math.min(Math.floor(growth), 3);
    const isTree = kind === "tree";
    const icon = isTree ? "🌳" : growthIcons[type]?.[stage] || "❓";
    const label = isDead ? "💀 Dead" : icon;

    const baseClasses = "rounded-lg p-2 text-center text-sm font-semibold cursor-pointer transition shadow-md relative";
    const liveClasses = isTree
      ? "bg-green-200 text-green-900"
      : "bg-lime-100 text-lime-800";
    const deadClasses = "bg-gray-200 text-gray-600 line-through";

    const needsWater = !isDead && !isTree && growth < harvestThresholds[type] && !watered;

    return (
      <div
        key={index}
        className={`${baseClasses} ${isDead ? deadClasses : liveClasses}`}
        onClick={() => onHarvest(index)}
        title={isDead ? "Click to clear" : `Harvest ${type}`}
      >
        {label}
        <div className="text-xs mt-1">{type}</div>
        {needsWater && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWater(index);
            }}
            title="Water this plant"
            className="absolute bottom-1 right-1 text-blue-500 hover:text-blue-700"
          >
            💧
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {spaces.map((slot, idx) =>
        slot ? renderOccupiedSlot(slot, idx) : renderEmptySlot(idx)
      )}
    </div>
  );
};

export default GardenGrid;