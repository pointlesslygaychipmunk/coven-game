import React from "react";
import type { Player } from "../../../shared/types";

export const InventoryBox = ({ player }: { player: Player }) => {
  if (!player || !player.inventory) {
    return <div>Loading inventory...</div>;
  }

  return (
    <div className="p-4 bg-white/70 rounded-xl shadow space-y-2">
      <h3 className="text-lg font-bold">Inventory</h3>
      <ul className="grid grid-cols-2 gap-2">
        {Object.entries(player.inventory).map(([key, value]) => (
          <li key={key} className="text-sm bg-gray-100 p-2 rounded">
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
};