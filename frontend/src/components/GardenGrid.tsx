import React from "react";
import type { Player } from "../../../shared/types";

interface GardenGridProps {
  spaces: (Player["garden"]["spaces"][number])[]; // better than 'any[]'
  player: Player;
  onPlantCrop: (type: "mushroom" | "flower" | "herb", index: number) => void;
  onPlantTree: (index: number) => void;
  onHarvest: (index: number) => void;
}

export const GardenGrid = ({
  spaces,
  player,
  onPlantCrop,
  onPlantTree,
  onHarvest
}: GardenGridProps) => {
  const canPlant = (type: "mushroom" | "flower" | "herb" | "fruit") => {
    return (player.inventory[type] ?? 0) > 0;
  };

  const isMatureCrop = (slot: any): boolean => {
    if (!slot || slot.kind !== "crop") return false;
  
    const thresholds: Record<"mushroom" | "flower" | "herb", number> = {
      mushroom: 4,
      flower: 3,
      herb: 2
    };
  
    const type = slot.type as "mushroom" | "flower" | "herb";
    return slot.growth >= thresholds[type];
  };  

  const renderPlot = (slot: any, index: number) => {
    const isEmpty = slot === null;

    const handleClickEmpty = (type: "mushroom" | "flower" | "herb" | "fruit") => {
      if (type === "fruit") {
        onPlantTree(index);
      } else {
        onPlantCrop(type, index);
      }
    };

    const handleClickPlanted = () => {
      if (!slot) return;

      if (slot.kind === "crop") {
        const mature = isMatureCrop(slot);
        const confirmed = window.confirm(
          mature
            ? `Harvest this mature ${slot.type}?`
            : `Remove this immature ${slot.type}? It will be lost.`
        );
        if (confirmed) onHarvest(index);
      } else if (slot.kind === "tree") {
        const confirmed = window.confirm(`Fell this tree? It will be removed permanently.`);
        if (confirmed) onHarvest(index); // assumed tree felling goes through onHarvest
      }
    };

    return (
      <div
        key={index}
        className="relative aspect-square rounded border border-gray-400 bg-white flex items-center justify-center shadow-sm"
      >
        {isEmpty ? (
          <div className="grid grid-cols-2 gap-1 p-1 text-xs">
            {["mushroom", "flower", "herb", "fruit"].map((type) => (
              <button
                key={type}
                disabled={!canPlant(type as any)}
                className={`rounded px-1 py-0.5 ${
                  canPlant(type as any)
                    ? "bg-green-200 hover:bg-green-300"
                    : "bg-gray-200 cursor-not-allowed"
                }`}
                onClick={() => handleClickEmpty(type as any)}
              >
                {type}
              </button>
            ))}
          </div>
        ) : (
          <button
            className="text-sm font-medium text-gray-700 hover:bg-red-100 px-2 py-1 rounded"
            onClick={handleClickPlanted}
          >
            {slot.type} 🌱
          </button>
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