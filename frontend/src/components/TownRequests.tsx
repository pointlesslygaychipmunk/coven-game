// frontend/src/components/TownRequests.tsx – List town requests and allow fulfillment
import React from 'react';
import type { TownRequestCard, Player, CropType } from '@shared/types';

interface TownRequestsProps {
  cards: TownRequestCard[];
  player: Player;
  onFulfill: (requestId: string) => void;
}

const TownRequests: React.FC<TownRequestsProps> = ({ cards, player, onFulfill }) => {
  if (cards.length === 0) {
    return <div className="p-4 text-center text-sm italic text-stone-400">No town requests at the moment.</div>;
  }
  return (
    <div className="p-4 bg-stone-900/80 rounded-xl">
      <h3 className="text-lg font-semibold mb-2">🏘️ Town Requests</h3>
      <ul className="space-y-2 text-sm">
        {cards.map(card => {
          const canFulfill = player.potions.some(potion =>
            Object.entries(card.potionNeeds).every(([ing, qty]) =>
              (potion.ingredients[ing as CropType] || 0) >= qty
            )
          );
          return (
            <li key={card.id} className="flex justify-between items-center">
              <span>
                {card.description}
                {card.season ? <em className="text-stone-400"> (Season: {card.season})</em> : null}
              </span>
              <button onClick={() => onFulfill(card.id)} disabled={!canFulfill}
                className="disabled:opacity-50 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs">
                Fulfill
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TownRequests;
