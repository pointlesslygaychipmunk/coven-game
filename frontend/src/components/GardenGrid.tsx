// frontend/src/components/GardenGrid.tsx
import React from "react";
import type { GardenSlot, Player } from "../../../shared/types";
import type { CropType } from "../../../shared/types";

const plantable: Array<"mushroom" | "flower" | "herb"> = [
  "mushroom", "flower", "herb"
];

const growthIcons: Record<CropType, string[]> = {
  mushroom: ["🟤","🍄","🍄🍄","🍄🍄🍄"],
  flower:   ["🌱","🪷","🌸","🪻"],
  herb:     ["🌱","☘️","🍀","🌾"],
  fruit:    ["🌱","🌿","🌳","🌳🍒"]
};

interface GardenGridProps {
  spaces: (GardenSlot | null)[];
  player: Player;
  onPlantCrop: (crop: CropType, idx: number) => void;
  onPlantTree: (idx: number) => void;
  onHarvest: (idx: number) => void;
}

export function GardenGrid({
  spaces, player, onPlantCrop, onPlantTree, onHarvest
}: GardenGridProps) {
  const renderEmpty = (i: number) => (
    <div
      key={i}
      className="
        border-2 border-dashed border-green-300 
        bg-white/40 rounded-lg p-2 text-center 
        shadow-inner hover:bg-green-50 transition
      "
    >
      {plantable.map((c) => (
        <button
          key={c}
          onClick={() => onPlantCrop(c, i)}
          disabled={player.inventory[c] <= 0}
          className="
            block w-full my-1 py-1 
            bg-green-100 hover:bg-green-200 
            rounded text-xs font-medium 
            disabled:opacity-40 transition
          "
        >
          🌱 Plant {c}
        </button>
      ))}
      <button
        onClick={() => onPlantTree(i)}
        disabled={player.inventory.fruit <= 0}
        className="
          block w-full my-1 py-1 
          bg-yellow-100 hover:bg-yellow-200 
          rounded text-xs font-medium 
          disabled:opacity-40 transition
        "
      >
        🌳 Grow Tree
      </button>
    </div>
  );

  const renderSlot = (slot: GardenSlot, i: number) => {
    const stage = Math.min(Math.floor(slot.growth), 3);
    const icon  = slot.kind === "tree"
      ? "🌳"
      : growthIcons[slot.type]?.[stage] ?? "❓";
    const label = slot.isDead ? "💀 Dead" : icon;
    const bg    = slot.isDead
      ? "bg-gray-200 text-gray-600 line-through"
      : slot.kind === "tree"
      ? "bg-green-200 text-green-900"
      : "bg-lime-100 text-lime-800";

    return (
      <div
        key={i}
        onClick={() => onHarvest(i)}
        title={slot.isDead ? "Clear dead" : `Harvest ${slot.type}`}
        className={`
          ${bg} rounded-lg p-4 text-center 
          cursor-pointer transform hover:scale-105 
          transition shadow
        `}
      >
        <div className="text-2xl">{label}</div>
        <div className="text-xs italic mt-1">{slot.type}</div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2 text-purple-800">
        🌾 Your Enchanted Garden
      </h2>
      <div className="p-4 grid grid-cols-4 gap-3">
        {spaces.map((s, i) => (s ? renderSlot(s, i) : renderEmpty(i)))}
      </div>
    </div>
  );
}
