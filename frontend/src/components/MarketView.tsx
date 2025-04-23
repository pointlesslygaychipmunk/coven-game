import React from 'react';
import type { PotionType } from '../../../shared/types';

interface MarketItem {
  price: number;
  stock: number;
}

interface MarketViewProps {
  market: Record<PotionType, MarketItem>;
  onBuy: (type: PotionType, qty: number) => void;
  onSell: (type: PotionType, qty: number) => void;
}

const iconMap: Record<PotionType, string> = {
  mushroom: '🍄',
  flower: '🌸',
  herb: '🌿',
  fruit: '🍎',
};

export const MarketView = ({ market, onBuy, onSell }: MarketViewProps) => {
  return (
    <div className="space-y-3 bg-white/80 p-4 rounded-xl shadow">
      <h3 className="text-lg font-bold text-purple-800">🏪 Market</h3>

      {Object.entries(market).map(([type, { price, stock }]) => {
        const typed = type as PotionType;
        const cappedStock = Math.max(0, Math.min(stock, 5));
        const stockIcons = Array(cappedStock).fill(iconMap[typed]);

        return (
          <div key={type} className="flex items-center justify-between border-b border-purple-200 py-2 text-sm">
            <div className="flex items-center gap-2 w-1/4">
              <span className="text-xl">{iconMap[typed]}</span>
              <span className="capitalize text-purple-900 font-medium">{typed}</span>
            </div>

            <div className="w-1/4 text-center text-yellow-800 font-semibold">
              💰 {price}
            </div>

            <div className="w-1/4 text-center text-xs text-gray-600">
              {stockIcons.map((icon, i) => (
                <span key={i} title={`Stock ${i + 1}`}>{icon}</span>
              ))}
            </div>

            <div className="w-1/4 flex gap-1 justify-end">
              <button
                onClick={() => onBuy(typed, 1)}
                disabled={stock <= 0}
                className="px-3 py-1 rounded-full text-white bg-green-400 hover:bg-green-500 disabled:opacity-40 text-xs"
              >
                🛍️ Buy
              </button>
              <button
                onClick={() => onSell(typed, 1)}
                className="px-3 py-1 rounded-full text-white bg-blue-400 hover:bg-blue-500 text-xs"
              >
                ↩️ Sell
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};