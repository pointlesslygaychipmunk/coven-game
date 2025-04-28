// frontend/src/components/RumorFeed.tsx – Display latest rumors
import React from 'react';
import type { Rumor } from '@shared/types';

interface RumorFeedProps {
  rumors: Rumor[];
}

const RumorFeed: React.FC<RumorFeedProps> = ({ rumors }) => {
  if (!rumors?.length) {
    return <div className="p-4 text-center text-sm italic text-stone-400">🌬️ No whispers reach you yet...</div>;
  }
  const sourceIcon = (source: Rumor['source']) => {
    switch (source) {
      case 'market':      return '📈';
      case 'town':        return '🏘️';
      case 'blackMarket': return '🌑';
      case 'quest':       return '✨';
    }
  };
  return (
    <div className="p-4 bg-stone-900/80 rounded-xl">
      <h3 className="text-lg font-semibold mb-2">💬 Rumors</h3>
      <ul className="text-sm space-y-1">
        {rumors.map(r => (
          <li key={r.id}>
            {sourceIcon(r.source)} {r.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RumorFeed;
