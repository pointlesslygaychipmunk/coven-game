// frontend/src/components/GardenGrid.tsx
import React from "react";
import type { GardenSlot, Player } from "../../../shared/types";

// Only valid crops, not "fruit" / "tree" which require special logic
const validCropTypes = ["mushroom", "flower", "herb"] as const;
type PlantableCrop = (typeof validCropTypes)[number];

const growthIcons: Record<string, string[]> = {
  mushroom: ["🟤", "🍄", "🍄🍄", "🍄🍄🍄"],
  flower:   ["🌱", "🪷", "🌸", "🪻"],
  herb:     ["🌱", "☘️", "🍀", "🌾"],
};

const treeStages = ["🌰", "🌿", "🌳", "🌳🍎"];

export function GardenGrid({
  spaces,
  player,
  onPlantCrop,
  onPlantTree,
  onHarvest,
}: {
  spaces: (GardenSlot | null)[];
  player: Player;
  onPlantCrop: (type: PlantableCrop, index: number) => void;
  onPlantTree: (index: number) => void;
  onHarvest: (index: number) => void;
}) {
  const renderEmptySlot = (index: number) => (
    <div
      key={index}
      className="border bg-white/40 backdrop-blur rounded-lg p-2 text-xs space-y-1 shadow-sm flex flex-col justify-center items-center"
    >
      {validCropTypes.map((type) => (
        <button
          key={type}
          className={`rounded w-full py-1 text-sm ${
            player.inventory[type] > 0
              ? "bg-green-100 hover:bg-green-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          } transition`}
          disabled={player.inventory[type] <= 0}
          onClick={() => onPlantCrop(type, index)}
        >
          🌱 {type}
        </button>
      ))}
      <button
        className={`rounded w-full py-1 text-sm ${
          player.inventory["fruit"] > 0
            ? "bg-yellow-100 hover:bg-yellow-200"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        } transition`}
        disabled={player.inventory["fruit"] <= 0}
        onClick={() => onPlantTree(index)}
      >
        🌳 plant tree
      </button>
    </div>
  );

  const renderOccupiedSlot = (slot: GardenSlot, index: number) => {
    const isDead = slot.isDead;
    const growth = Math.min(Math.floor(slot.growth), 3);
    const isTree = slot.kind === "tree";

    const icon = isDead
      ? "💀"
      : isTree
      ? treeStages[growth]
      : growthIcons[slot.type]?.[growth] ?? "❓";

    const label = isDead ? "Dead" : `${slot.type}`;

    const baseStyle =
      "border rounded-lg p-3 text-center text-lg font-semibold cursor-pointer transition-all shadow flex flex-col items-center justify-center";
    const activeStyle = isDead
      ? "bg-gray-300 text-gray-600 line-through"
      : isTree
      ? "bg-emerald-100 text-emerald-800"
      : "bg-green-200 text-green-900";

    return (
      <div
        key={index}
        className={`${baseStyle} ${activeStyle}`}
        onClick={() => onHarvest(index)}
      >
        <div className="text-2xl">{icon}</div>
        <div className="text-xs mt-1 capitalize">{label}</div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2 text-purple-800">🌾 Garden</h2>
      <div className="grid grid-cols-4 gap-3">
        {spaces.map((slot, i) =>
          slot === null ? renderEmptySlot(i) : renderOccupiedSlot(slot, i)
        )}
      </div>
    </div>
  );
}