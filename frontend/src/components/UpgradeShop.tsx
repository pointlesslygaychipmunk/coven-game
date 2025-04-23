import React from 'react';

export const UpgradeShop = ({
  upgrades,
  onUpgrade
}: {
  upgrades: Record<'well' | 'cellar' | 'cart' | 'cauldron', number>;
  onUpgrade: (type: 'well' | 'cellar' | 'cart' | 'cauldron') => void;
}) => {
  const upgradeNames = {
    well: '🔮 Well',
    cellar: '🏺 Cellar',
    cart: '🛒 Cart',
    cauldron: '⚗️ Cauldron'
  };

  return (
    <div className="p-4 bg-lime-50 rounded-xl border border-lime-300 shadow space-y-3">
      <h3 className="text-lg font-bold text-lime-800">🏗️ Upgrade Shop</h3>
      {Object.entries(upgrades).map(([type, level]) => (
        <div key={type} className="flex justify-between items-center">
          <div className="text-sm">{upgradeNames[type as keyof typeof upgradeNames]} — Level {level}</div>
          <button
            className="px-3 py-1 text-sm bg-lime-200 rounded hover:bg-lime-300"
            onClick={() => onUpgrade(type as any)}
          >
            Upgrade
          </button>
        </div>
      ))}
    </div>
  );
};
