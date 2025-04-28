import type { Rumor } from '@shared/types';

interface RumorFeedProps {
  rumors: Rumor[];
}

export default function RumorFeed({ rumors }: RumorFeedProps) {
  return (
    <div className="p-4 bg-gradient-to-br from-black via-stone-800 to-black rounded-lg ethereal-border fade-in-spell">
      <h2 className="text-lg shimmer-text mb-3">🗣️ Whispered Rumors</h2>
      <ul className="space-y-2 text-sm italic text-stone-400">
        {rumors.length > 0 ? (
          rumors.map(r => (
            <li key={r.id} className="text-stone-300">“{r.message}”</li>
          ))
        ) : (
          <li className="text-stone-500">No rumors at the moment…</li>
        )}
      </ul>
    </div>
  );
}
