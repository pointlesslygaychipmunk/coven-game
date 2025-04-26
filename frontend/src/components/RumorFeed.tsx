import React from "react";
import type { Rumor } from "../../../shared/types";

export interface RumorFeedProps {
  rumors: Rumor[];
}

const RumorFeed: React.FC<RumorFeedProps> = ({ rumors }) => {
  if (!rumors.length) return null;
  return (
    <div className="bg-yellow-50 rounded-lg p-4 ring-1 ring-yellow-200">
      <h2 className="text-xl font-semibold mb-2">🗣️ Rumors</h2>
      <ul className="list-disc ml-5 text-sm text-yellow-800">
        {rumors.map((r) => (
          <li key={r.id}>{r.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default RumorFeed;