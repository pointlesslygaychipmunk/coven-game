import React from 'react';
import type { MarketItem, Player } from '@shared/types';

interface Props {
  market: MarketItem[];
  player?: Player;
  sendAction: (action: any) => void;
}

const Market: React.FC<Props> = ({ market, player, sendAction }) => {
  if (!player) return null;

  return (
    <div className="space-y-2">
      {market.map((item) => (
        <div key={item.name} className="flex justify-between items-center bg-gray-700 p-2 rounded">
          <div>
            {item.name} – {item.price}g
          </div>
          <div>
            <button
              className="px-2 py-1 text-xs bg-purple-700 rounded disabled:opacity-50"
              disabled={player.gold < item.price}
              onClick={() => sendAction({ type: 'buy', playerId: player.id, itemName: item.name })}
            >
              Buy
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Market;
