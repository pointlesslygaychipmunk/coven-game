// frontend/src/components/Market.tsx
import React, { useState, useEffect } from 'react';
import { MarketItem, Player } from '@shared/types';
import './Market.css';

interface MarketProps {
  market: MarketItem[];
  player: Player;
  onBuy: (itemId: string) => void;
  onSell: (itemId: string) => void;
}

const Market: React.FC<MarketProps> = ({ market, player, onBuy, onSell }) => {
  // State for market interactions
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceChanges, setPriceChanges] = useState<Record<string, number>>({});

  // Store previous prices to track changes
  useEffect(() => {
    const changes: Record<string, number> = {};
    
    market.forEach(item => {
      const previousPrice = priceChanges[item.id] ? (item.price - priceChanges[item.id]) : 0;
      changes[item.id] = previousPrice;
    });
    
    setPriceChanges(changes);
  }, [market]);

  // Get unique categories from market items
  const categories = ['all', ...new Set(market.map(item => item.type))];

  // Filter and sort market items
  const filteredItems = market
    .filter(item => 
      // Category filter
      (selectedCategory === 'all' || item.type === selectedCategory) &&
      // Search filter
      (searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      // Sort by selected column
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'type') {
        comparison = a.type.localeCompare(b.type);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      }
      
      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Toggle sort direction when clicking the same column
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Calculate if player can afford an item
  const canAfford = (price: number) => player.gold >= price;

  // Check if player has an item in inventory
  const getInventoryQuantity = (itemName: string) => {
    const inventoryItem = player.inventory.find(item => item.name === itemName);
    return inventoryItem ? inventoryItem.quantity : 0;
  };

  // Format price change as a percentage
  const getPriceChangePercent = (itemId: string, currentPrice: number) => {
    const previousPrice = priceChanges[itemId];
    
    if (!previousPrice) return 0;
    
    const change = currentPrice - previousPrice;
    const percentChange = (change / previousPrice) * 100;
    
    return Math.round(percentChange * 10) / 10; // Round to 1 decimal place
  };

  // Get class and symbol for price change
  const getPriceChangeDisplay = (itemId: string, currentPrice: number) => {
    const percentChange = getPriceChangePercent(itemId, currentPrice);
    
    if (Math.abs(percentChange) < 0.5) return { class: '', symbol: '' };
    
    if (percentChange > 0) {
      return {
        class: 'price-increase',
        symbol: '▲'
      };
    } else {
      return {
        class: 'price-decrease',
        symbol: '▼'
      };
    }
  };

  // Get appropriate icon for item category
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'seed': return '🌱';
      case 'ingredient': return '🌿';
      case 'potion': return '🧪';
      case 'tool': return '🔨';
      case 'ritual_item': return '✨';
      default: return '📦';
    }
  };

  return (
    <div className="market-container">
      <div className="market-header">
        <h2>Town Market</h2>
        <div className="player-gold">
          Your Gold: <span className="gold-amount">{player.gold}</span>
        </div>
      </div>
      
      <div className="market-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="category-filter">
          <label>Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="market-table-container">
        <table className="market-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className={sortBy === 'name' ? 'sorted' : ''}>
                Item Name
                {sortBy === 'name' && (
                  <span className="sort-arrow">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => handleSort('type')} className={sortBy === 'type' ? 'sorted' : ''}>
                Type
                {sortBy === 'type' && (
                  <span className="sort-arrow">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => handleSort('price')} className={sortBy === 'price' ? 'sorted' : ''}>
                Price
                {sortBy === 'price' && (
                  <span className="sort-arrow">{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th>In Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-market">
                  No items found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredItems.map(item => {
                const priceChange = getPriceChangeDisplay(item.id, item.price);
                const inventoryQuantity = getInventoryQuantity(item.name);
                
                return (
                  <tr key={item.id} className={`market-item ${inventoryQuantity > 0 ? 'in-inventory' : ''}`}>
                    <td className="item-name">
                      <span className="item-icon">{getItemIcon(item.type)}</span>
                      {item.name}
                    </td>
                    <td className="item-type">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </td>
                    <td className={`item-price ${priceChange.class}`}>
                      {item.price} gold
                      {priceChange.symbol && (
                        <span className="price-trend" title={`${getPriceChangePercent(item.id, item.price)}% change`}>
                          {priceChange.symbol}
                        </span>
                      )}
                    </td>
                    <td className="inventory-quantity">
                      {inventoryQuantity > 0 ? (
                        <span className="in-stock">{inventoryQuantity}</span>
                      ) : (
                        <span className="out-of-stock">0</span>
                      )}
                    </td>
                    <td className="item-actions">
                      <button
                        className="buy-button"
                        onClick={() => onBuy(item.id)}
                        disabled={!canAfford(item.price)}
                        title={!canAfford(item.price) ? "Not enough gold" : "Buy 1"}
                      >
                        Buy
                      </button>
                      <button
                        className="sell-button"
                        onClick={() => onSell(item.id)}
                        disabled={inventoryQuantity <= 0}
                        title={inventoryQuantity <= 0 ? "None in inventory" : "Sell 1"}
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      <div className="market-footer">
        <div className="market-info">
          <p>
            <span className="price-increase">▲</span> Price rising
            &nbsp;&nbsp;&nbsp;
            <span className="price-decrease">▼</span> Price falling
          </p>
          <p className="market-tip">
            Tip: Prices fluctuate based on supply and demand. Buy low, sell high!
          </p>
        </div>
        
        <div className="inventory-summary">
          <h3>Your Inventory</h3>
          <div className="inventory-grid">
            {player.inventory.length === 0 ? (
              <p className="empty-inventory">Your inventory is empty.</p>
            ) : (
              player.inventory
                .filter(item => item.quantity > 0)
                .map(item => (
                  <div key={item.id} className="inventory-item">
                    <span className="item-icon">
                      {getItemIcon(item.type)}
                    </span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    
                    {/* Show sell button for quick selling */}
                    <button
                      className="quick-sell"
                      onClick={() => onSell(item.id)}
                      title="Sell 1"
                    >
                      Sell
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;