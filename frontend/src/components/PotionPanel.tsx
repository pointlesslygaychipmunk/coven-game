import React from 'react';
import type { Player } from '../../../shared/types';

interface PotionPanelProps {
  player: Player;
  onBrew: (potionId: string) => void;
}

const PotionPanel: React.FC<PotionPanelProps> = ({ player, onBrew }) => {
  const { potions } = player;
  if (potions.length === 0) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 ring-1 ring-blue-200 italic text-blue-700 text-center">
        No potions available to brew… 🧪✨
      </div>
    );
  }
  return (
    <div className="bg-blue-50 rounded-lg p-4 ring-1 ring-blue-200 space-y-2">
      <h2 className="text-xl font-semibold mb-2">🔮 Craft Potions</h2>
      <ul className="space-y-1">
        {potions.map((p) => (
          <li key={p.id}>
            <button
              className="w-full text-left px-3 py-1 bg-blue-200 hover:bg-blue-300 rounded transition"
              onClick={() => onBrew(p.id)}
            >
              Brew {p.name} ({p.tier})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PotionPanel;