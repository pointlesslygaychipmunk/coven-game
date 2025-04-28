// frontend/src/components/InventoryBox.tsx – Display player's inventory contents
import React from 'react';
import type { CropType } from '@shared/types';

interface InventoryBoxProps {
  items: Record<CropType, number>;
}

const InventoryBox: React.FC<InventoryBoxProps> = ({ items }) => {
  const entries = Object.entries(items).filter(([, qty]) => qty > 0);
  return (
    <div className="bg-stone-900/80 text-stone-200 rounded-xl p-3">
      <h3 className="text-lg shimmer-text mb-2">Inventory</h3>
      {entries.length ? (
        <div className="flex flex-wrap gap-2">
          {entries.map(([crop, qty]) => (
            <span key={crop} className="rounded-full bg-stone-700/70 px-3 py-1 text-xs font-semibold">
              {crop} × {qty}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs italic text-stone-400">Empty satchel…</p>
      )}
    </div>
  );
};

export default InventoryBox;
