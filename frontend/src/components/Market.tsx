// frontend/src/components/Market.tsx – Market view for buying/selling
import React from 'react';
import type { MarketState, MarketItem, Player } from '@shared/types';

interface MarketProps {
  market: MarketState;
  player: Player;
  onBuy: (itemId: string) => void;
  onSell: (itemId: string) => void;
}

const Market: React.FC<MarketProps> = ({ market, player, onBuy, onSell }) => {
  const items = Object.entries(market.items);
  if (!items.length) {
    return <div className="p-4 text-center text-sm italic text-stone-400">Market is closed.</div>;
  }
  return (
    <div className="p-4 bg-stone-900/80 rounded-xl">
      <h3 className="text-lg font-semibold mb-2">🏷️ Market</h3>
      <table className="w-full text-sm">
        <thead className="text-stone-400">
          <tr>
            <th className="text-left">Item</th>
            <th>Price</th>
            <th>Stock</th>
            <th colSpan={2}></th>
          </tr>
        </thead>
        <tbody>
          {items.map(([id, item]) => {
            const name = ('name' in item && typeof item.name === 'string') ? item.name : (id.charAt(0).toUpperCase() + id.slice(1));
            const price = item.currentPrice ?? item.price;
            const canBuy = player.gold >= price && (item.stock ?? 0) > 0;
            let canSell = false;
            if (item.type === 'crop' || item.type === 'ingredient') {
              (player.inventory[id as keyof typeof player.inventory] ?? 0)
            }
            return (
              <tr key={id}>
                <td>{name}</td>
                <td className="text-center">{price}g</td>
                <td className="text-center">{item.stock ?? 0}</td>
                <td className="text-right">
                  <button onClick={() => onBuy(id)} disabled={!canBuy}
                    className="disabled:opacity-50 px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs">
                    Buy
                  </button>
                </td>
                <td className="text-left">
                  <button onClick={() => onSell(id)} disabled={!canSell}
                    className="disabled:opacity-50 px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs">
                    Sell
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Market;
