import React from 'react';

export const WellStatus = ({ level }: { level: number }) => {
  const waterUnits = level * 2;
  const droplets = Array(waterUnits).fill('💧');

  return (
    <div className="text-sm mt-2">
      <h3 className="font-semibold text-emerald-700 mb-1">Your Well</h3>
      <div className="flex gap-1 text-lg">
        {droplets.map((drop, i) => (
          <span key={i}>{drop}</span>
        ))}
      </div>
      <p className="text-xs text-stone-500 mt-1">Replenishes each moon.</p>
    </div>
  );
};
