import type { TownRequestCard } from '@shared/types';

interface TownRequestsProps {
  cards: TownRequestCard[];
  onFulfill: (requestId: string) => void;
}

export default function TownRequests({ cards, onFulfill }: TownRequestsProps) {
  if (!cards?.length) {
    return (
      <div className="p-4 text-center text-sm italic text-stone-400">
        🌒 Town requests are being prepared...
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-black via-stone-800 to-black rounded-xl ethereal-border fade-in-spell">
      {/* TODO: Display real town requests */}
    </div>
  );
}
