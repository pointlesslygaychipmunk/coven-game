// frontend/src/components/GardenGrid.tsx
import React from "react";
import type { GardenSlotObject, Player } from "../../../shared/types";

export function GardenGrid({
  spaces,
  player,
  onPlantCrop,
  onPlantTree,
  onHarvest,
}: {
  spaces: GardenSlotObject[];
  player: Player;
  onPlantCrop: (type: "mushroom" | "flower" | "herb", index: number) => void;
  onPlantTree: (index: number) => void;
  onHarvest: (index: number) => void;
}) {
  const renderSlot = (slot: GardenSlotObject, index: number) => {
    if (slot === null) {
      return (
        <div key={index} className="border bg-white/40 backdrop-blur rounded p-2 text-xs space-y-1">
          {["mushroom", "flower", "herb"].map((type) => (
            <button
              key={type}
              className="bg-green-100 hover:bg-green-200 rounded w-full"
              onClick={() => onPlantCrop(type as any, index)}
            >
              {type}
            </button>
          ))}
          <button
            className="bg-yellow-100 hover:bg-yellow-200 rounded w-full"
            onClick={() => onPlantTree(index)}
          >
            fruit 🌳
          </button>
        </div>
      );
    }

    const isDead = slot.isDead;
    const growth = Math.floor(slot.growth);
    const typeDisplay =
      slot.kind === "tree"
        ? `🌳 Tree (${growth})`
        : `${slot.type} (${growth})`;

    return (
      <div
        key={index}
        className={`border rounded p-2 text-center text-sm font-semibold transition-all ${
          isDead
            ? "bg-gray-300 text-gray-600 line-through"
            : "bg-green-200 animate-pulse"
        }`}
        onClick={() => onHarvest(index)}
      >
        {isDead ? "💀 Dead" : typeDisplay}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Garden</h2>
      <div className="grid grid-cols-4 gap-2">
        {spaces.map((slot, i) => renderSlot(slot, i))}
      </div>
    </div>
  );
}