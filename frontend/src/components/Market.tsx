import React from 'react';
import type { MarketItem, InventoryItem } from '../../../shared/src/types';

interface MarketProps {
  market: MarketItem[];
  playerGold: number;
  inventory: InventoryItem[];
  onBuy: (itemName: string) => void;
  onSell: (itemName: string) => void;
}

const Market: React.FC<MarketProps> = ({ market, playerGold, inventory, onBuy, onSell }) => {
  const sortedMarket = [...market].sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.name.localeCompare(b.name);
  });
  const hasItem = (itemName: string) => inventory.some(it => it.name === itemName && it.quantity > 0);
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b border-gray-700">
          <th className="px-2">Item</th>
          <th className="px-2">Price</th>
          <th className="px-2">Buy</th>
          <th className="px-2">Sell</th>
        </tr>
      </thead>
      <tbody>
        {sortedMarket.map(item => {
          const outOfStock = item.available !== undefined && item.available <= 0;
          return (
            <tr key={item.name} className="border-b border-gray-800">
              <td className="px-2 py-1">{item.name}</td>
              <td className="px-2 py-1">{item.price}g</td>
              <td className="px-2 py-1">
                <button 
                  className="px-2 py-1 text-xs bg-green-700 rounded disabled:opacity-50" 
                  disabled={playerGold < item.price || outOfStock}
                  onClick={() => onBuy(item.name)}
                >
                  Buy
                </button>
                {outOfStock && <span className="text-xs text-gray-400 ml-1">Out of stock</span>}
              </td>
              <td className="px-2 py-1">
                <button 
                  className="px-2 py-1 text-xs bg-yellow-700 rounded disabled:opacity-50"
                  disabled={!hasItem(item.name)}
                  onClick={() => onSell(item.name)}
                >
                  Sell
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Market;
