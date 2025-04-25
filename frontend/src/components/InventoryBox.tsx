// frontend/src/components/InventoryBox.tsx
import React from "react";
import type { Player, PotionIngredient } from "../../../shared/types";
import Tooltip from "./Tooltip";
import { useTooltip } from "../useTooltip";

interface InventoryBoxProps {
  player: Player;
}

const resourceTips: Record<string, string> = {
  gold: "Currency for upgrades and special events.",
  mana: "Fuel for magical actions like brewing potions and fortune-telling.",
  craftPoints: "Earned by fulfilling requests; used for rare upgrades.",
  water: "Essential for planting crops. Refills each turn based on your Well upgrade.",
};

const itemTips: Record<PotionIngredient, string> = {
  mushroom: "Earthy and potent. Used in potions and town requests.",
  flower: "Beautiful but fragile. High value in brewing and decor.",
  herb: "Quick-growing. Essential for basic alchemy.",
  fruit: "Harvested from trees. Special mana-linked properties!",
};

export const InventoryBox: React.FC<InventoryBoxProps> = ({ player }) => {
  const goldTip = useTooltip();
  const manaTip = useTooltip();
  const craftTip = useTooltip();
  const waterTip = useTooltip();

  const potionCounts: Record<PotionIngredient, number> = {
    mushroom: 0,
    flower: 0,
    herb: 0,
    fruit: 0,
  };
  player.potions.forEach((p) => {
    for (const ing of Object.keys(p.ingredients) as PotionIngredient[]) {
      if (p.ingredients[ing] > 0) {
        potionCounts[ing]++;
      }
    }
  });

  return (
    <div className="bg-white/70 rounded-lg shadow-md p-4 space-y-6">
      <h2 className="text-center font-bold text-xl text-purple-700">Inventory</h2>

      {/* Resources */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-lg font-semibold text-center">
        <div onMouseEnter={goldTip.show} onMouseLeave={goldTip.hide} className="relative">
          🪙 {player.gold}
          <Tooltip visible={goldTip.visible}>
            {resourceTips.gold}
          </Tooltip>
        </div>
        <div onMouseEnter={manaTip.show} onMouseLeave={manaTip.hide} className="relative">
          ✨ {player.mana}
          <Tooltip visible={manaTip.visible}>
            {resourceTips.mana}
          </Tooltip>
        </div>
        <div onMouseEnter={craftTip.show} onMouseLeave={craftTip.hide} className="relative">
          🛠️ {player.craftPoints}
          <Tooltip visible={craftTip.visible}>
            {resourceTips.craftPoints}
          </Tooltip>
        </div>
        <div onMouseEnter={waterTip.show} onMouseLeave={waterTip.hide} className="relative">
          💧 {player.upgrades.well * 2} water
          <Tooltip visible={waterTip.visible}>
            {resourceTips.water}
          </Tooltip>
        </div>
      </div>

      {/* Crops */}
      <div>
        <h3 className="text-center font-semibold text-purple-500 mb-1">Crops</h3>
        <div className="flex justify-around">
          {(Object.keys(itemTips) as PotionIngredient[]).map((item) => {
            const tip = useTooltip();
            return (
              <div key={item} onMouseEnter={tip.show} onMouseLeave={tip.hide} className="relative">
                🌱 {item}: {player.inventory[item]}
                <Tooltip visible={tip.visible}>
                  {itemTips[item]}
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>

      {/* Potions */}
      <div>
        <h3 className="text-center font-semibold text-purple-500 mb-1">Potions</h3>
        <div className="flex justify-around">
          {(Object.keys(potionCounts) as PotionIngredient[]).map((key) => {
            const tip = useTooltip();
            return (
              <div key={key} onMouseEnter={tip.show} onMouseLeave={tip.hide} className="relative">
                🧪 {key}: {potionCounts[key]}
                <Tooltip visible={tip.visible}>
                  {`Potions brewed with ${key}`}
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};