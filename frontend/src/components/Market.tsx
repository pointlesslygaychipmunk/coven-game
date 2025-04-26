import React from 'react';
import type {
  BasicMarketItem,
  PotionMarketItem,
  BlackMarketItem,
} from '../../../shared/types';

type MarketItem = BasicMarketItem | PotionMarketItem | BlackMarketItem;

interface MarketProps {
  marketItems: Record<string, MarketItem>;
  onBuy: (itemId: string) => void;
  onSell: (itemId: string) => void;
  onAcquireBlack?: (itemId: string) => void;
}

export const Market: React.FC<MarketProps> = ({
  marketItems,
  onBuy,
  onSell,
  onAcquireBlack,
}) => {
  const emojiMap: Record<string, string> = {
    mushroom: '🍄',
    flower:   '🌸',
    herb:     '🌿',
    fruit:    '🍎',
  };

  const basics  = Object.entries(marketItems).filter(([, i]) => i.type === 'crop' || i.type === 'ingredient');
  const potions = Object.entries(marketItems).filter(([, i]) => i.type === 'potion');
  const blacks  = Object.entries(marketItems).filter(([, i]) => i.type === 'blackMarket');

  const renderItem = (
    key: string,
    item: MarketItem,
    actionBtn: React.ReactNode
  ) => {
    const label = 'name' in item ? item.name : key;
    const price = 'currentPrice' in item && item.currentPrice != null ? item.currentPrice : item.price;
    const stock = item.stock;
    return (
      <li key={key} className="p-3 bg-purple-50 border border-purple-200 rounded shadow hover:bg-purple-100 transition">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">{emojiMap[key] || '🧪'}</span>
            <span className="capitalize font-medium text-purple-800">{label}</span>
            {'tier' in item && <span className="text-xs text-purple-500 italic">({item.tier})</span>}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>💰 {price}</span>
            <span>📦 {stock}</span>
            {actionBtn}
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 border border-purple-200 space-y-4">
      <h2 className="text-lg font-bold text-purple-700">🏬 Market</h2>

      {basics.length > 0 && (
        <section>
          <h3 className="font-semibold text-purple-500 mb-1">🌱 Crops & Ingredients</h3>
          <ul className="space-y-2">
            {basics.map(([k, i]) =>
              renderItem(
                k,
                i,
                <>
                  <button className="px-2 py-1 bg-green-200 rounded" onClick={() => onBuy(k)}>Buy</button>
                  <button className="px-2 py-1 bg-red-200 rounded"   onClick={() => onSell(k)}>Sell</button>
                </>
              )
            )}
          </ul>
        </section>
      )}

      {potions.length > 0 && (
        <section>
          <h3 className="font-semibold text-purple-500 mb-1">🧪 Potions</h3>
          <ul className="space-y-2">
            {potions.map(([k, i]) =>
              renderItem(k, i, <button className="px-2 py-1 bg-green-200 rounded" onClick={() => onBuy(k)}>Buy</button>)
            )}
          </ul>
        </section>
      )}

      {blacks.length > 0 && (
        <section>
          <h3 className="font-semibold text-purple-500 mb-1">🕸️ Black Market</h3>
          <ul className="space-y-2">
            {blacks.map(([k, i]) =>
              renderItem(k, i, <button className="px-2 py-1 bg-black text-white rounded" onClick={() => onAcquireBlack?.(k)}>Acquire</button>)
            )}
          </ul>
        </section>
      )}
    </div>
  );
};