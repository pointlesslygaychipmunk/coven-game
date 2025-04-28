import type { Rumor } from '@shared/types';

interface RumorFeedProps {
  rumors: Rumor[];
}

export default function RumorFeed({ rumors }: RumorFeedProps) {
  if (!rumors?.length) {
    return (
      <div className="p-4 text-center text-sm italic text-stone-400">
        🌬 No whispers reach you yet...
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-black via-stone-800 to-black rounded-xl ethereal-border fade-in-spell">
      {/* TODO: Display real rumors */}
    </div>
  );
}