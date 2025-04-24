import React from "react";
import type { Player } from "../../../shared/types";

interface GardenGridProps {
  spaces: any[];
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
  onHarvest,
}: GardenGridProps) => {
  const canPlant = (type: "mushroom" | "flower" | "herb" | "fruit") => {
    return (player.inventory[type] ?? 0) > 0;
  };

  const isMatureCrop = (
    slot: any
  ): slot is { kind: "crop"; type: "mushroom" | "flower" | "herb"; growth: number } => {
    if (!slot || slot.kind !== "crop") return false;
  
    const thresholds: Record<"mushroom" | "flower" | "herb", number> = {
      mushroom: 4,
      flower: 3,
      herb: 2,
    };
  
    const type = slot.type as "mushroom" | "flower" | "herb"; // ✅ Assertion here
    return slot.growth >= thresholds[type];
  };  

  const getGrowthEmoji = (slot: any) => {
    if (slot.kind === "crop") {
      if (isMatureCrop(slot)) return "✂️";
      if (slot.growth === 1) return "🌱";
      if (slot.growth === 2) return "🌿";
      return "🌾";
    }
    if (slot.kind === "tree") {
      return slot.growth >= 3 ? "🌳" : "🌴";
    }
    return "";
  };

  const renderPlot = (slot: any, index: number) => {
    const isEmpty = !slot?.type && !slot?.kind;

    const handleClickEmpty = (type: "mushroom" | "flower" | "herb" | "fruit") => {
      if (type === "fruit") {
        onPlantTree(index);
      } else {
        onPlantCrop(type, index);
      }
    };

    const handleClickPlanted = () => {
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
        if (confirmed) onHarvest(index);
      }
    };

    return (
      <div
        key={index}
        className="relative aspect-square rounded border border-gray-400 bg-white flex items-center justify-center shadow-sm p-1"
      >
        {isEmpty ? (
          <div className="grid grid-cols-2 gap-1 w-full h-full">
            {(["mushroom", "flower", "herb", "fruit"] as const).map((type) => (
              <button
                key={type}
                disabled={!canPlant(type)}
                className={`text-xs rounded font-medium transition px-1 py-0.5 ${
                  canPlant(type)
                    ? "bg-green-200 hover:bg-green-300 text-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => handleClickEmpty(type)}
              >
                {type}
              </button>
            ))}
          </div>
        ) : (
          <button
            className={`w-full h-full text-sm font-semibold rounded flex flex-col justify-center items-center transition text-center p-1 ${
              isMatureCrop(slot)
                ? "bg-yellow-100 hover:bg-yellow-200 text-green-900"
                : slot.kind === "tree"
                ? "bg-lime-200 hover:bg-lime-300 text-lime-900"
                : "bg-blue-100 hover:bg-blue-200 text-blue-800"
            }`}
            onClick={handleClickPlanted}
          >
            <span>{slot.type}</span>
            <span className="text-lg">{getGrowthEmoji(slot)}</span>
          </button>
        )}
      </div>
    );
  };

  return <div className="grid grid-cols-3 gap-2">{spaces.map(renderPlot)}</div>;
};