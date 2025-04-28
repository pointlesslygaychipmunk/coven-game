import React from 'react';
import type { GardenSlot, InventoryItem } from '../../../shared/src/types';

interface GardenGridProps {
  garden: GardenSlot[];
  selectedItem: InventoryItem | null;
  onSlotClick: (slotId: number) => void;
}

const GardenGrid: React.FC<GardenGridProps> = ({ garden, selectedItem, onSlotClick }) => {
  // Using a fixed 4-column grid layout for the garden
  return (
    <div className="grid grid-cols-4 gap-1">
      {garden.map(slot => {
        const plant = slot.plant;
        let displayChar = '';
        let extraClass = '';
        if (plant) {
          const isMature = plant.growth >= plant.growthRequired;
          // Use first letter of plant name as icon, with color highlight if mature
          displayChar = plant.name.charAt(0).toUpperCase();
          extraClass = ' plant';
          if (isMature) {
            extraClass += ' mature';
          }
        } else {
          displayChar = '+';
          extraClass = ' empty';
        }
        return (
          <div 
            key={slot.id} 
            className={`grid-slot${extraClass}`}
            onClick={() => onSlotClick(slot.id)}
          >
            {plant ? (
              <span title={`${plant.name} (${plant.growth}/${plant.growthRequired})${plant.watered ? ' [Watered]' : ''}`}>
                {displayChar}
              </span>
            ) : (
              <span title={selectedItem && selectedItem.category === 'seed' ? `Plant ${selectedItem.name}` : 'Empty plot'}>
                {displayChar}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GardenGrid;
