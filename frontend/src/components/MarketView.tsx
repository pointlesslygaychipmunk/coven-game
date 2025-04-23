import React from 'react';

interface MarketItem {
  type: 'mushroom' | 'flower' | 'herb' | 'fruit';
  price: number;
  stock: number;
}

interface MarketViewProps {
  market: Record<string, { price: number; stock: number }>;
  onBuy: (type: string, qty: number) => void;
  onSell: (type: string, qty: number) => void;
}

const iconMap: Record<string, string> = {
  mushroom: '🍄',
  flower: '🌸',
  herb: '🌿',
  fruit: '🍎'
};

export const MarketView = ({ market, onBuy, onSell }: MarketViewProps) => {
  const renderRow = (type: string) => {
    const { price, stock } = market[type];
    const safeStock = typeof stock === 'number' && stock >= 0 ? stock : 0;
    const displayIcons = Array(Math.min(safeStock, 5)).fill(iconMap[type]);

    return (
      <div key={type} className="flex items-center justify-between border-b py-2 text-sm">
        <div className="flex items-center gap-2 w-1/3">
          <span className="text-xl">{iconMap[type]}</span>
          <span className="capitalize">{type}</span>
        </div>
        <div className="w-1/4 text-center">${price}</div>
        <div className="w-1/4 text-center">
          {displayIcons.map((icon, i) => (
            <span key={i}>{icon}</span>
          ))}
        </div>
        <div className="w-1/6 flex gap-1 justify-end">
          {stock > 0 && (
            <button
              onClick={() => onBuy(type, 1)}
              className="px-2 py-0.5 bg-green-200 hover:bg-green-300 rounded text-xs"
            >
              🛍️ Buy
            </button>
          )}
          <button
            onClick={() => onSell(type, 1)}
            className="px-2 py-0.5 bg-blue-200 hover:bg-blue-300 rounded text-xs"
          >
            ↩️ Sell
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {Object.keys(market).map(type => renderRow(type))}
    </div>
  );
};
