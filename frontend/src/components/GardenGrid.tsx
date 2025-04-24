import React from "react";
import type { Player } from "../../../shared/types";

interface GardenGridProps {
  spaces: any[];
  player: Player;
  onPlantCrop: (type: "mushroom" | "flower" | "herb" | "fruit", index: number) => void;
  onPlantTree: () => void;
}

export const GardenGrid = ({ spaces, player, onPlantCrop, onPlantTree }: GardenGridProps) => {
  const canPlant = (type: "mushroom" | "flower" | "herb" | "fruit") => {
    return (player.inventory[type] ?? 0) > 0;
  };

  const renderPlot = (slot: any, index: number) => {
    const isEmpty = !slot?.type;
    const handleClick = (type: "mushroom" | "flower" | "herb" | "fruit") => {
      if (isEmpty && canPlant(type)) {
        onPlantCrop(type, index);
      }
    };

    return (
      <div key={index} className="relative aspect-square rounded border border-gray-400 bg-white flex items-center justify-center shadow-sm">
        {isEmpty ? (
          <div className="grid grid-cols-2 gap-1 p-1 text-xs">
            {["mushroom", "flower", "herb", "fruit"].map((type) => (
              <button
                key={type}
                disabled={!canPlant(type as any)}
                className={`rounded px-1 py-0.5 ${canPlant(type as any) ? "bg-green-200 hover:bg-green-300" : "bg-gray-200 cursor-not-allowed"}`}
                onClick={() => handleClick(type as any)}
              >
                {type}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm font-medium text-gray-700">
            {slot.type} 🌱
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {spaces.map((slot, index) => renderPlot(slot, index))}
    </div>
  );
};