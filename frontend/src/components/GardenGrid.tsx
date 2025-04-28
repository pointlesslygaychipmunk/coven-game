import React from 'react';
import type { GardenSlot } from '@shared/types';

interface Props {
  garden: GardenSlot[];
  onPlant: (slotId: number, seedName: string) => void;
  onWater: (slotId: number) => void;
  onHarvest: (slotId: number) => void;
}

const GardenGrid: React.FC<Props> = ({ garden, onPlant, onWater, onHarvest }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {garden.map((slot) => (
        <div
          key={slot.id}
          className={`grid-slot ${slot.plant ? 'plant' : 'empty'}`}
        >
          {slot.plant ? (
            <div className="flex flex-col items-center">
              <span className="text-sm">{slot.plant.name}</span>
              <span className="text-xs">
                {slot.plant.growth}/{slot.plant.growthRequired}
              </span>
              {slot.plant.growth >= slot.plant.growthRequired ? (
                <button
                  className="mt-1 px-2 py-1 text-xs bg-green-600 rounded"
                  onClick={() => onHarvest(slot.id)}
                >
                  Harvest
                </button>
              ) : !slot.plant.watered ? (
                <button
                  className="mt-1 px-2 py-1 text-xs bg-blue-600 rounded"
                  onClick={() => onWater(slot.id)}
                >
                  Water
                </button>
              ) : (
                <div className="text-xs mt-1 text-gray-400">Watered</div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400">Empty</span>
              {/* Planting would be done via inventory, no direct click here */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GardenGrid;
