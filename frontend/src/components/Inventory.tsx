import React from 'react';
import type { InventoryItem } from '../../../shared/src/types';

interface InventoryProps {
  inventory: InventoryItem[];
  selectedItem: InventoryItem | null;
  onSelectItem: (item: InventoryItem) => void;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, selectedItem, onSelectItem }) => {
  // Group items by category for display
  const categories: Record<string, InventoryItem[]> = {};
  for (const item of inventory) {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  }
  const categoryOrder: Array<InventoryItem['category']> = ['seed', 'herb', 'potion'];
  return (
    <div>
      {categoryOrder.map(cat => (
        categories[cat] ? (
          <div key={cat} className="mb-2">
            <div className="font-semibold capitalize">
              {cat === 'seed' ? 'Seeds' : cat === 'herb' ? 'Herbs' : 'Potions'}:
            </div>
            <ul>
              {categories[cat].map(item => (
                <li 
                  key={item.name} 
                  className={`cursor-pointer ${selectedItem && selectedItem.name === item.name ? 'selected-item' : ''}`}
                  onClick={() => onSelectItem(item)}
                >
                  {item.name} x{item.quantity} {item.tier && item.tier > 1 ? `(Tier ${item.tier})` : ''}
                </li>
              ))}
            </ul>
          </div>
        ) : null
      ))}
    </div>
  );
};

export default Inventory;
