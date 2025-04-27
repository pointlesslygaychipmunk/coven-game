import React from 'react';
import type { Rumor } from '../../../shared/src/types';

interface RumorFeedProps {
  rumors: Rumor[];
}

const RumorFeed: React.FC<RumorFeedProps> = ({ rumors }) => (
  <div className="bg-white shadow rounded p-4 border border-purple-200">
    <h2 className="font-bold mb-2">🗣️ Rumor Feed</h2>
    <ul className="space-y-1 text-sm italic text-gray-700">
      {rumors.length > 0 ? (
        rumors.map((r) => (
          <li key={r.id}>
            “{r.message}”
          </li>
        ))
      ) : (
        <li className="text-gray-500">No rumors at the moment…</li>
      )}
    </ul>
  </div>
);

export default RumorFeed;