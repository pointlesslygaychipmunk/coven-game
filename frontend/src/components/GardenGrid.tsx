// frontend/src/components/GardenGrid.tsx
import React from "react";
import type { GardenSlot, Player } from "../../../shared/types";

// Only valid crops, not "fruit" / "tree" which require special logic
const validCropTypes = ["mushroom", "flower", "herb"] as const;
type PlantableCrop = (typeof validCropTypes)[number];

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
      className="border bg-white/40 backdrop-blur rounded p-2 text-xs space-y-1 shadow-sm"
    >
      {validCropTypes.map((type) => (
        <button
          key={type}
          className="bg-green-100 hover:bg-green-200 rounded w-full py-1 transition"
          disabled={player.inventory[type] <= 0}
          onClick={() => onPlantCrop(type, index)}
        >
          🌱 {type}
        </button>
      ))}
      <button
        className="bg-yellow-100 hover:bg-yellow-200 rounded w-full py-1 transition"
        disabled={!player.inventory["fruit"] || player.inventory["fruit"] <= 0}
        onClick={() => onPlantTree(index)}
      >
        🌳 plant tree
      </button>
    </div>
  );

  const renderOccupiedSlot = (slot: GardenSlot, index: number) => {
    const isDead = slot.isDead;
    const growth = Math.floor(slot.growth);
    const isTree = slot.kind === "tree";
    const emoji = isTree ? "🌳" : "🌱";
    const label = isDead ? "💀 Dead" : `${emoji} ${slot.type} (${growth})`;

    const baseStyle =
      "border rounded p-2 text-center text-sm font-semibold cursor-pointer transition-all shadow";
    const activeStyle = isDead
      ? "bg-gray-300 text-gray-600 line-through"
      : isTree
      ? "bg-green-100 text-green-800"
      : "bg-green-200 text-green-900";

    return (
      <div
        key={index}
        className={`${baseStyle} ${activeStyle}`}
        onClick={() => onHarvest(index)}
      >
        {label}
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