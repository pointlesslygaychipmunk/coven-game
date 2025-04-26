// frontend/src/components/RumorFeed.tsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";    // ← default import
import type { Rumor } from "../../../shared/types";

const socket = io("https://playcoven.com");  // ← same default

export const RumorFeed: React.FC = () => {
  const [rumors, setRumors] = useState<Rumor[]>([]);

  useEffect(() => {
    socket.on("rumors", (feed: Rumor[]) => setRumors(feed));
    return () => void socket.off("rumors");
  }, []);

  return (
    <div className="w-1/3 p-4 bg-white shadow rounded">
      <h2 className="font-bold mb-2">🗣️ Rumor Feed</h2>
      <ul className="space-y-1 text-sm">
        {rumors.map(r => (
          <li key={r.id} className="italic text-gray-700">
            “{r.message}” — <span className="text-xs text-gray-400">{new Date(r.timestamp).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};