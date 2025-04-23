import React, { useState } from "react";
import type { PlayerAction } from "../../../shared/types";
import { ACTION_LABELS } from "../../../shared/types";

interface ActionSelectorProps {
  onSubmit: (actions: PlayerAction[]) => void;
}

export default function ActionSelector({ onSubmit }: ActionSelectorProps) {
  const [selected, setSelected] = useState<PlayerAction[]>([]);

  const toggleAction = (action: PlayerAction) => {
    if (selected.includes(action)) {
      setSelected(selected.filter(a => a !== action));
    } else if (selected.length < 2) {
      setSelected([...selected, action]);
    }
  };

  const handleSubmit = () => {
    onSubmit(["water", ...selected]);
  };

  const actionOptions: PlayerAction[] = [
    "plant", "harvest", "brew", "buy", "sell",
    "upgrade", "fulfill", "forage", "fortune", "lady"
  ];

  return (
    <div className="bg-white p-6 rounded shadow-xl max-w-md mx-auto border border-gray-200">
      <h2 className="text-lg font-semibold text-indigo-700 mb-2">🌙 Start of Turn</h2>
      <p className="text-sm text-gray-700 mb-4">
        💧 Watering is required this turn. Choose 1–2 additional actions:
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {actionOptions.map(action => (
          <button
            key={action}
            className={`text-sm px-3 py-2 border rounded transition-colors duration-150
              ${selected.includes(action)
                ? "bg-indigo-500 text-white border-indigo-600"
                : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-indigo-100"}`}
            onClick={() => toggleAction(action)}
          >
            {ACTION_LABELS[action]}
          </button>
        ))}
      </div>

      <button
        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        onClick={handleSubmit}
        disabled={selected.length === 0}
      >
        ✅ Confirm Actions
      </button>
    </div>
  );
}