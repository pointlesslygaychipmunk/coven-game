// frontend/src/components/GardenGrid.tsx
import React from "react";
import type { GardenSlot, Player } from "../../../shared/types";

const validCropTypes = ["mushroom", "flower", "herb"] as const;
type PlantableCrop = (typeof validCropTypes)[number];

const growthIcons: Record<string, string[]> = {
  mushroom: ["🟤", "🍄", "🍄🍄", "🍄🍄🍄"],
  flower: ["🌱", "🪷", "🌸", "🪻"],
  herb: ["🌱", "☘️", "🍀", "🌾"],
  fruit: ["🌱", "🌿", "🌳", "🌳"], // used visually before tree state
};

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
      className="border-2 border-dashed border-green-300 bg-white/40 rounded-lg p-2 text-xs space-y-1 text-center shadow-sm"
    >
      {validCropTypes.map((type) => (
        <button
          key={type}
          className="bg-green-100 hover:bg-green-200 rounded w-full py-1 font-medium transition disabled:opacity-30"
          disabled={player.inventory[type] <= 0}
          onClick={() => onPlantCrop(type, index)}
        >
          🌱 Plant {type}
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

  const renderOccupiedSlot = (slot: GardenSlot, index: number) => {
    const isDead = slot.isDead;
    const isTree = slot.kind === "tree";
    const growth = Math.min(Math.floor(slot.growth), 3);
    const icon = isTree ? "🌳" : growthIcons[slot.type]?.[growth] ?? "❓";
    const label = isDead ? "💀 Dead" : `${icon}`;

    const base =
      "rounded-lg p-2 text-center text-sm font-semibold cursor-pointer transition shadow-md";
    const live = isTree
      ? "bg-green-200 text-green-900"
      : "bg-lime-100 text-lime-800";
    const dead = "bg-gray-200 text-gray-600 line-through";

    return (
      <div
        key={index}
        className={`${base} ${isDead ? dead : live}`}
        onClick={() => onHarvest(index)}
        title={isDead ? "Click to clear" : `Harvest ${slot.type}`}
      >
        {label}
        <div className="text-xs">{slot.type}</div>
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