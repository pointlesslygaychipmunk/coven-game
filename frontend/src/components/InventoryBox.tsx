// frontend/src/components/InventoryBox.tsx
import React from "react";
import type { Player } from "../../../shared/types";
import {
  Droplets,
  Sparkles,
  Coins,
  Hammer,
  Star,
  FlaskConical,
  Leaf,
  TreePine,
} from "lucide-react";

export function InventoryBox({ player }: { player: Player }) {
  if (!player || !player.inventory || !player.potions) {
    return <div>Loading inventory...</div>;
  }

  const statBox = (label: string, value: number | string, Icon: any, color: string) => (
    <div className={`bg-${color}-100 text-${color}-900 rounded px-3 py-2 flex items-center gap-2 shadow-sm`}>
      <Icon className="w-4 h-4" />
      <span className="font-medium">{label}:</span>
      <span className="font-bold ml-auto">{value}</span>
    </div>
  );

  return (
    <div className="p-4 bg-white/90 rounded-xl shadow-xl space-y-4">
      <h3 className="text-xl font-bold text-purple-800 tracking-tight">🎒 Inventory & Status</h3>

      {/* Crops & Trees */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-1">🌱 Crops & 🌳 Fruit</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {["mushroom", "flower", "herb", "fruit"].map((key) => (
            <div key={key} className="bg-green-100 text-green-900 rounded px-2 py-1 flex justify-between items-center shadow-sm">
              <span className="capitalize">{key}</span>
              <span className="font-bold">{player.inventory[key as keyof typeof player.inventory]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Potions */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mt-2 mb-1">🧪 Potions</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {["mushroom", "flower", "herb", "fruit"].map((key) => (
            <div key={key} className="bg-indigo-100 text-indigo-900 rounded px-2 py-1 flex justify-between items-center shadow-sm">
              <span className="capitalize">{key}</span>
              <span className="font-bold">{player.potions[key as keyof typeof player.potions]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-gray-300">
        {statBox("Water", player.upgrades.well * 2, Droplets, "blue")}
        {statBox("Mana", player.mana, Sparkles, "indigo")}
        {statBox("Gold", player.gold, Coins, "yellow")}
        {statBox("Craft", player.craftPoints, Hammer, "rose")}
        {statBox("Renown", player.renown, Star, "green")}
        {statBox("Upgrades", Object.values(player.upgrades).reduce((a, b) => a + b, 0), FlaskConical, "purple")}
      </div>
    </div>
  );
}