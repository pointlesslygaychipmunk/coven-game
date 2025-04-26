import React from 'react';
import type { Player } from '../../../shared/types';
import Tooltip from './Tooltip';
import { useTooltip } from '../useTooltip';

interface InventoryBoxProps {
  player: Player;
}

const resourceTips: Record<string, string> = {
  gold: 'Currency for upgrades and special events.',
  mana: 'Fuel for magical actions like brewing potions.',
  craftPoints: 'Earned by fulfilling requests; used for rare upgrades.',
  water: 'Refills each turn based on your Well upgrade.',
};

const ingredientTips: Record<string, string> = {
  mushroom: 'Earthy and potent.',
  flower: 'Delicate and valuable in brewing.',
  herb:   'Essential for basic alchemy.',
  fruit:  'Harvested from trees; magic-infused!',
};

export const InventoryBox: React.FC<InventoryBoxProps> = ({ player }) => {
  const goldTip  = useTooltip();
  const manaTip  = useTooltip();
  const craftTip = useTooltip();
  const waterTip = useTooltip();
  const ingredientTooltips = Array.from({ length: 4 }, () => useTooltip());
  const potionTooltips     = Array.from({ length: 10 }, () => useTooltip());

  // Count potions by name
  const potionCounts: Record<string, number> = {};
  player.potions.forEach((p) => {
    potionCounts[p.name] = (potionCounts[p.name] || 0) + 1;
  });
  const potionNames = Object.keys(potionCounts);
  const inventoryKeys = Object.keys(player.inventory) as (keyof typeof player.inventory)[];

  return (
    <div className="bg-white/80 rounded-lg p-4 shadow-md space-y-4">
      <h2 className="text-lg font-bold text-purple-700 text-center">Inventory</h2>

      {/* Resources */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm font-semibold">
        <div onMouseEnter={goldTip.show}  onMouseLeave={goldTip.hide}  className="relative">
          🪙 {player.gold}
          <Tooltip visible={goldTip.visible}>{resourceTips.gold}</Tooltip>
        </div>
        <div onMouseEnter={manaTip.show}  onMouseLeave={manaTip.hide}  className="relative">
          ✨ {player.mana}
          <Tooltip visible={manaTip.visible}>{resourceTips.mana}</Tooltip>
        </div>
        <div onMouseEnter={craftTip.show} onMouseLeave={craftTip.hide} className="relative">
          🔧 {player.craftPoints}
          <Tooltip visible={craftTip.visible}>{resourceTips.craftPoints}</Tooltip>
        </div>
        <div onMouseEnter={waterTip.show} onMouseLeave={waterTip.hide} className="relative">
          💧 {player.upgrades.well * 2}
          <Tooltip visible={waterTip.visible}>{resourceTips.water}</Tooltip>
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <h3 className="font-semibold text-purple-600 mb-1">🌱 Ingredients</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          {inventoryKeys.map((item, idx) => (
            <div
              key={item}
              className="relative"
              onMouseEnter={ingredientTooltips[idx].show}
              onMouseLeave={ingredientTooltips[idx].hide}
            >
              🌾 {item}: {player.inventory[item]}
              <Tooltip visible={ingredientTooltips[idx].visible}>{ingredientTips[item]}</Tooltip>
            </div>
          ))}
        </div>
      </div>

      {/* Potions */}
      <div>
        <h3 className="font-semibold text-purple-600 mb-1">🧪 Potions</h3>
        {potionNames.length > 0 ? (
          <div className="flex flex-wrap gap-4 text-sm">
            {potionNames.map((name, idx) => (
              <div
                key={name}
                className="relative"
                onMouseEnter={potionTooltips[idx].show}
                onMouseLeave={potionTooltips[idx].hide}
              >
                🧪 {name}: {potionCounts[name]}
                <Tooltip visible={potionTooltips[idx].visible}>
                  You have {potionCounts[name]} bottle{potionCounts[name] > 1 ? 's' : ''} of {name}.
                </Tooltip>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center italic text-gray-500">No potions brewed yet.</p>
        )}
      </div>
    </div>
  );
};