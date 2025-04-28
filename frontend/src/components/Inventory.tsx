import React from 'react';
import type { InventoryItem, Player } from '@shared/types';

interface Props {
  inventory: InventoryItem[];
  onBuy: (item: string) => void;
  onSell: (item: string) => void;
}

const Inventory: React.FC<Props> = ({ inventory, onBuy, onSell }) => {
  return (
    <div className="space-y-2">
      {inventory.map((item) => (
        <div key={item.name} className="flex justify-between items-center bg-gray-800 p-2 rounded">
          <div>
            {item.name} x{item.quantity}
          </div>
          <div className="space-x-2">
            <button
              className="px-2 py-1 text-xs bg-green-700 rounded"
              onClick={() => onBuy(item.name)}
            >
              Buy
            </button>
            <button
              className="px-2 py-1 text-xs bg-yellow-600 rounded"
              onClick={() => onSell(item.name)}
            >
              Sell
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Inventory;
