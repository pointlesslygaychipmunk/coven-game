// src/components/InventoryBox.tsx
import React from "react";
import type { Player } from "../../../shared/types";
import Tooltip from "./Tooltip";
import { useTooltip } from "../useTooltip";

interface InventoryBoxProps {
  player: Player;
}

export const InventoryBox: React.FC<InventoryBoxProps> = ({ player }) => {
  const goldTip = useTooltip();
  const manaTip = useTooltip();
  const craftTip = useTooltip();
  const waterTip = useTooltip();

  const resourceTips: Record<string, string> = {
    gold: "Currency for upgrades and special events.",
    mana: "Fuel for magical actions like brewing potions and fortune-telling.",
    craftPoints: "Earned by fulfilling requests; used for rare upgrades.",
    water: "Essential for planting crops. Refills each turn based on your Well upgrade.",
  };

  const itemTips: Record<string, string> = {
    mushroom: "Earthy and potent. Used in potions and town requests.",
    flower: "Beautiful but fragile. High value in brewing and decor.",
    herb: "Quick-growing. Essential for basic alchemy.",
    fruit: "Harvested from trees. Special mana-linked properties!",
  };

  const potionTips: Record<string, string> = {
    mushroom: "Mushroom Potion: Heals ailments and grants endurance.",
    flower: "Flower Potion: Inspires courage and charm.",
    herb: "Herb Potion: Quick recovery and mental clarity.",
    fruit: "Fruit Potion: Boosts magical power during full moons.",
  };

  return (
    <div className="bg-white/70 rounded-lg shadow-md p-4 space-y-4">
      <h2 className="text-center font-bold text-xl text-purple-700">Inventory</h2>

      {/* Resources */}
      <div className="flex justify-around text-lg font-semibold">
        <div onMouseEnter={goldTip.show} onMouseLeave={goldTip.hide} className="relative">
          🪙 {player.gold}
          <Tooltip visible={goldTip.visible} position={goldTip.position}>
            {resourceTips.gold}
          </Tooltip>
        </div>

        <div onMouseEnter={manaTip.show} onMouseLeave={manaTip.hide} className="relative">
          ✨ {player.mana}
          <Tooltip visible={manaTip.visible} position={manaTip.position}>
            {resourceTips.mana}
          </Tooltip>
        </div>

        <div onMouseEnter={craftTip.show} onMouseLeave={craftTip.hide} className="relative">
          🛠️ {player.craftPoints}
          <Tooltip visible={craftTip.visible} position={craftTip.position}>
            {resourceTips.craftPoints}
          </Tooltip>
        </div>

        <div onMouseEnter={waterTip.show} onMouseLeave={waterTip.hide} className="relative">
          💧 {player.upgrades.well * 2} water
          <Tooltip visible={waterTip.visible} position={waterTip.position}>
            {resourceTips.water}
          </Tooltip>
        </div>
      </div>

      {/* Inventory Items */}
      <div className="mt-6">
        <h3 className="text-center font-semibold text-purple-500 mb-2">Crops</h3>
        <div className="flex justify-around">
          {["mushroom", "flower", "herb", "fruit"].map((item) => {
            const tip = useTooltip();
            return (
              <div key={item} onMouseEnter={tip.show} onMouseLeave={tip.hide} className="relative">
                🌱 {item}: {player.inventory[item as keyof typeof player.inventory]}
                <Tooltip visible={tip.visible} position={tip.position}>
                  {itemTips[item]}
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>

      {/* Potion Inventory */}
      <div className="mt-6">
        <h3 className="text-center font-semibold text-purple-500 mb-2">Potions</h3>
        <div className="flex justify-around">
          {["mushroom", "flower", "herb", "fruit"].map((potion) => {
            const tip = useTooltip();
            return (
              <div key={potion} onMouseEnter={tip.show} onMouseLeave={tip.hide} className="relative">
                🧪 {potion}: {player.potions[potion as keyof typeof player.potions]}
                <Tooltip visible={tip.visible} position={tip.position}>
                  {potionTips[potion]}
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};