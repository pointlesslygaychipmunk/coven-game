import React from "react";
import type { GardenSlot } from "@shared/types";

interface GardenGridProps {
  garden: GardenSlot[];
}

const GardenGrid: React.FC<GardenGridProps> = ({ garden }) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {garden.map((slot, index) => (
        <div
          key={index}
          className={`border rounded p-2 ${slot.dead ? "bg-gray-300" : "bg-green-100"}`}
          title={slot.crop ? `${slot.crop}${slot.dead ? " (dead)" : ""}` : "Empty"}
        >
          {slot.crop ? (
            <span>
              {slot.crop} {slot.dead && "💀"} {slot.watered && !slot.dead && "💧"}
            </span>
          ) : (
            <span className="text-gray-500">Empty</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default GardenGrid;
