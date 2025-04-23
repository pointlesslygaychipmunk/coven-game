import React from "react";
import type { Player } from "../../../shared/types";
import { Droplets, Sparkles, Coins, Hammer } from "lucide-react";

export const InventoryBox = ({ player }: { player: Player }) => {
  if (!player || !player.inventory) {
    return <div>Loading inventory...</div>;
  }

  return (
    <div className="p-4 bg-white/80 rounded-xl shadow space-y-4">
      <h3 className="text-lg font-bold text-purple-800">🎒 Player Inventory</h3>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {Object.entries(player.inventory).map(([key, value]) => (
          <div key={key} className="bg-purple-100 text-purple-900 rounded px-2 py-1 flex justify-between items-center shadow-sm">
            <span className="capitalize">{key}</span>
            <span className="font-semibold">{value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mt-4">
        <div className="bg-blue-100 text-blue-900 rounded px-2 py-1 flex items-center gap-1 shadow-sm">
          <Droplets className="w-4 h-4" /> <span className="font-semibold">Water:</span> {player.upgrades.well * 2}
        </div>
        <div className="bg-indigo-100 text-indigo-900 rounded px-2 py-1 flex items-center gap-1 shadow-sm">
          <Sparkles className="w-4 h-4" /> <span className="font-semibold">Mana:</span> {player.mana}
        </div>
        <div className="bg-yellow-100 text-yellow-900 rounded px-2 py-1 flex items-center gap-1 shadow-sm">
          <Coins className="w-4 h-4" /> <span className="font-semibold">Gold:</span> {player.gold}
        </div>
        <div className="bg-rose-100 text-rose-900 rounded px-2 py-1 flex items-center gap-1 shadow-sm">
          <Hammer className="w-4 h-4" /> <span className="font-semibold">Craft:</span> {player.craftPoints}
        </div>
      </div>
    </div>
  );
};