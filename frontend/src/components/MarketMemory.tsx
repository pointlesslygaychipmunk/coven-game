// frontend/src/components/MarketMemory.tsx

import React from "react";
import type { MarketMemoryEntry } from "../../../shared/types";

interface MarketMemoryProps {
  entries: MarketMemoryEntry[];
}

export const MarketMemory: React.FC<MarketMemoryProps> = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="p-4 bg-white shadow rounded-xl border border-gray-200 text-center text-sm text-gray-500">
        No market memory yet.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow rounded-xl border border-gray-200 space-y-3">
      <h2 className="text-lg font-bold text-purple-700">🧠 Market Memory</h2>
      <ul className="text-sm space-y-1">
        {entries.map((e, i) => (
          <li key={i} className="flex justify-between">
            <span>
              {new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – <span className="font-medium">{e.itemId}</span>
            </span>
            <span>
              {e.volume > 0 ? "Bought" : "Sold"} {Math.abs(e.volume)} @ {e.price}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
