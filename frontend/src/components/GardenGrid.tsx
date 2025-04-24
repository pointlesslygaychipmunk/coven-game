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
  onHarvest
}: GardenGridProps) => {
  const canPlant = (type: "mushroom" | "flower" | "herb" | "fruit") =>
    (player.inventory[type] ?? 0) > 0;

  const isMatureCrop = (
    slot: { kind: string; type: "mushroom" | "flower" | "herb"; growth: number }
  ) => {
    const thresholds = { mushroom: 4, flower: 3, herb: 2 };
    return slot.growth >= thresholds[slot.type];
  };

  const getGrowthEmoji = (slot: any): string => {
    if (slot.kind === "crop") {
      if (slot.isDead) return "☠️";
      if (isMatureCrop(slot)) return "🌾";
      if (slot.growth === 1) return "🌱";
      if (slot.growth === 2) return "🌿";
      return "🍀";
    }
    if (slot.kind === "tree") {
      return slot.growth >= 3 ? "🍎" : "🌳";
    }
    return "";
  };

  const renderPlot = (slot: any, index: number) => {
    const isEmpty = slot === null;

    const handleClickEmpty = (type: "mushroom" | "flower" | "herb" | "fruit") => {
      if (type === "fruit") onPlantTree(index);
      else onPlantCrop(type, index);
    };

    const handleClickPlanted = () => {
      const confirmText =
        slot.kind === "tree"
          ? `Fell this tree? It will be removed permanently.`
          : slot.isDead
          ? `Remove this dead ${slot.type}?`
          : isMatureCrop(slot)
          ? `Harvest this mature ${slot.type}?`
          : `Remove this immature ${slot.type}? It will be lost.`;
      if (window.confirm(confirmText)) onHarvest(index);
    };

    return (
      <div
        key={index}
        className={`aspect-square rounded border bg-white flex items-center justify-center shadow-sm
          ${slot?.isDead ? "border-red-500 bg-gray-100 text-red-600" : "border-gray-400"}
        `}
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
            className={`text-lg font-bold transition-all duration-200 hover:scale-105 ${
              slot.isDead ? "text-red-600" : "text-gray-700"
            }`}
            onClick={handleClickPlanted}
          >
            {getGrowthEmoji(slot)}
          </button>
        )}
      </div>
    );
  };

  return <div className="grid grid-cols-3 gap-2">{spaces.map(renderPlot)}</div>;
};