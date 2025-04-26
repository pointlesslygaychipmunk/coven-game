import React from "react";
import type { Player, Potion } from "../../../shared/types";

export interface PotionPanelProps {
  player: Player;
  onBrew: (potionId: string) => void;
}

const PotionPanel: React.FC<PotionPanelProps> = ({ player, onBrew }) => {
  const { potions } = player;
  if (!potions.length) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 ring-1 ring-blue-200 italic text-blue-700">
        No potions to brew.
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg p-4 ring-1 ring-blue-200">
      <h2 className="text-xl font-semibold mb-2">🔮 Craft Potions</h2>
      <ul className="space-y-2">
        {potions.map((p: Potion) => (
          <li key={p.id}>
            <button
              onClick={() => onBrew(p.id)}
              className="px-3 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300 transition"
            >
              Brew {p.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PotionPanel;