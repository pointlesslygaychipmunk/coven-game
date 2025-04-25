// src/components/InventoryBox.tsx
import React from "react";
import type { Player } from "../../../shared/types";
import Tooltip from "./Tooltip";
import { useTooltip } from "../useTooltip";

interface InventoryBoxProps {
  player: Player;
}

const resourceTips = {
  gold: "Currency for upgrades and special events.",
  mana: "Fuel for magical actions like brewing potions and fortune-telling.",
  craftPoints: "Earned by fulfilling requests; used for rare upgrades.",
  water: "Essential for planting crops. Refills each turn based on your Well upgrade.",
} as const;

const ingredientTips = {
  mushroom: "Earthy and potent. Used in potions and town requests.",
  flower: "Beautiful but fragile. High value in brewing and decor.",
  herb: "Quick-growing. Essential for basic alchemy.",
  fruit: "Harvested from trees. Special mana-linked properties!",
} as const;

export const InventoryBox: React.FC<InventoryBoxProps> = ({ player }) => {
  // Fixed, unconditional tooltip hooks
  const goldTip = useTooltip();
  const manaTip = useTooltip();
  const craftTip = useTooltip();
  const waterTip = useTooltip();

  const allIngredients = Object.keys(player.inventory) as (keyof typeof ingredientTips)[];
  const ingredientHooks = allIngredients.map(() => useTooltip());

  const potionCounts: Record<string, number> = {};
  for (const potion of player.potions) {
    potionCounts[potion.name] = (potionCounts[potion.name] || 0) + 1;
  }

  const potionNames = Object.keys(potionCounts);
  const potionHooks = potionNames.map(() => useTooltip());

  return (
    <div className="bg-white/70 rounded-lg shadow-md p-4 space-y-6">
      <h2 className="text-center font-bold text-xl text-purple-700">Inventory</h2>

      {/* Resources */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-lg font-semibold text-center">
        <div onMouseEnter={goldTip.show} onMouseLeave={goldTip.hide} className="relative">
          🪙 {player.gold}
          <Tooltip visible={goldTip.visible}>{resourceTips.gold}</Tooltip>
        </div>
        <div onMouseEnter={manaTip.show} onMouseLeave={manaTip.hide} className="relative">
          ✨ {player.mana}
          <Tooltip visible={manaTip.visible}>{resourceTips.mana}</Tooltip>
        </div>
        <div onMouseEnter={craftTip.show} onMouseLeave={craftTip.hide} className="relative">
          🛠️ {player.craftPoints}
          <Tooltip visible={craftTip.visible}>{resourceTips.craftPoints}</Tooltip>
        </div>
        <div onMouseEnter={waterTip.show} onMouseLeave={waterTip.hide} className="relative">
          💧 {player.upgrades.well * 2} water
          <Tooltip visible={waterTip.visible}>{resourceTips.water}</Tooltip>
        </div>
      </div>

      {/* Crops */}
      <div>
        <h3 className="text-center font-semibold text-purple-500 mb-1">🌱 Crops</h3>
        <div className="flex flex-wrap justify-around gap-3 text-center">
          {allIngredients.map((item, i) => (
            <div
              key={item}
              onMouseEnter={ingredientHooks[i].show}
              onMouseLeave={ingredientHooks[i].hide}
              className="relative"
            >
              🌾 {item}: {player.inventory[item]}
              <Tooltip visible={ingredientHooks[i].visible}>
                {ingredientTips[item]}
              </Tooltip>
            </div>
          ))}
        </div>
      </div>

      {/* Potions */}
      <div>
        <h3 className="text-center font-semibold text-purple-500 mb-1">🧪 Potions</h3>
        {potionNames.length === 0 ? (
          <p className="text-sm text-center text-gray-500">No potions brewed yet.</p>
        ) : (
          <div className="flex flex-wrap justify-around gap-3 text-center">
            {potionNames.map((name, i) => (
              <div
                key={name}
                onMouseEnter={potionHooks[i].show}
                onMouseLeave={potionHooks[i].hide}
                className="relative"
              >
                🧪 {name}: {potionCounts[name]}
                <Tooltip visible={potionHooks[i].visible}>
                  You have {potionCounts[name]} bottle{potionCounts[name] > 1 ? "s" : ""} of "{name}".
                </Tooltip>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};