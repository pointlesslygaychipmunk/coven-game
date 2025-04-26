// frontend/src/components/PotionPanel.tsx
import React from 'react';
import type { Potion, CropType } from '../../../shared/types';

interface PotionPanelProps {
  potions: Potion[];
  inventory: Record<CropType, number>;
  onBrew: (p: Potion) => void;
}

export const PotionPanel: React.FC<PotionPanelProps> = ({ potions, inventory, onBrew }) => {
  const canBrew = (potion: Potion) =>
    Object.entries(potion.ingredients).every(
      ([type, amt]) => inventory[type as CropType] >= amt
    );

  return (
    <div className="w-1/2 p-4 bg-white shadow rounded space-y-3">
      <h2 className="text-lg font-bold">⚗️ Craft Potions</h2>
      {potions.length === 0 && <p className="text-sm italic">No recipes.</p>}
      <ul className="space-y-2">
        {potions.map(p => (
          <li key={p.id} className="flex justify-between items-center">
            <div>
              <div className="font-medium">{p.name} <span className="text-xs italic">({p.tier})</span></div>
              <div className="text-sm text-gray-600">
                {Object.entries(p.ingredients).map(([type, amt]) => (
                  <span key={type} className="mr-2">
                    {type}×{amt}
                  </span>
                ))}
              </div>
            </div>
            <button
              disabled={!canBrew(p)}
              onClick={() => onBrew(p)}
              className={`px-3 py-1 rounded ${
                canBrew(p)
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              Brew
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
