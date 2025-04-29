// frontend/src/components/BlackMarket.tsx
import React, { useState, useEffect } from 'react';
import { MarketItem, Player, GameTime } from '@shared/types';
import { getBlackMarketTrends } from '../api';
import './BlackMarket.css';

interface BlackMarketProps {
  market: MarketItem[];
  player: Player;
  time: GameTime;
  onBuy: (itemId: string, traderId?: string) => Promise<any>;
}

const BlackMarket: React.FC<BlackMarketProps> = ({ market, player, time, onBuy }) => {
  // State for black market interactions
  const [selectedTrader, setSelectedTrader] = useState<string | null>(null);
  const [marketTrends, setMarketTrends] = useState<any>({});
  const [recentlyPurchased, setRecentlyPurchased] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showTraders, setShowTraders] = useState<boolean>(false);

  // Fetch market trends on component mount and when market updates
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await getBlackMarketTrends(player.id);
        if (response.success) {
          setMarketTrends(response.trends);
        }
      } catch (error) {
        console.error('Failed to fetch black market trends:', error);
      }
    };
    
    fetchTrends();
  }, [player.id, market]);

  // Available traders based on current moon phase
  const availableTraders = [
    {
      id: 'shadow_merchant',
      name: 'The Shadow Merchant',
      specialization: 'rare herbs',
      discount: 0.1, // 10% discount on herbs
      phases: ['New Moon', 'Waning Crescent'],
      reputation: 15
    },
    {
      id: 'moonlight_trader',
      name: 'The Moonlight Trader',
      specialization: 'essences',
      discount: 0.15, // 15% discount on essences
      phases: ['Full Moon', 'Waxing Gibbous'],
      reputation: 25
    },
    {
      id: 'witch_emissary',
      name: 'The Witch Emissary',
      specialization: 'ritual items',
      discount: 0.2, // 20% discount on ritual items
      phases: ['First Quarter', 'Last Quarter'],
      reputation: 40
    }
  ].filter(trader => 
    trader.phases.includes(time.phaseName) && 
    player.reputation >= trader.reputation
  );

  // Handle purchasing items
  const handleBuy = async (itemId: string) => {
    try {
      const result = await onBuy(itemId, selectedTrader || undefined);
      
      if (result.success) {
        // Add to recently purchased
        setRecentlyPurchased(prev => [...prev, itemId]);
        
        // Remove from recently purchased after 3 seconds
        setTimeout(() => {
          setRecentlyPurchased(prev => prev.filter(id => id !== itemId));
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to purchase item:', error);
    }
  };

  // Format price with trend indicator
  const formatPrice = (item: MarketItem) => {
    const trend = marketTrends[item.id];
    if (!trend) return `${item.price} gold`;
    
    const trendSymbol = trend.trend === 'rising' ? '▲' : 
                         trend.trend === 'falling' ? '▼' : '•';
    
    const trendClass = trend.trend === 'rising' ? 'rising' : 
                        trend.trend === 'falling' ? 'falling' : '';
    
    return (
      <span className={`price ${trendClass}`}>
        {item.price} gold
        <span className="trend-indicator" title={`${trend.trend} trend`}>
          {trendSymbol}
        </span>
      </span>
    );
  };

  // Get rarity color class
  const getRarityClass = (rarity?: string) => {
    switch (rarity) {
      case 'rare': return 'rare-item';
      case 'legendary': return 'legendary-item';
      case 'mythic': return 'mythic-item';
      default: return '';
    }
  };

  // Calculate discounted price if trader selected
  const getDiscountedPrice = (item: MarketItem) => {
    if (!selectedTrader) return item.price;
    
    const trader = availableTraders.find(t => t.id === selectedTrader);
    if (!trader) return item.price;
    
    // Apply discount if trader specializes in this type
    if (
      item.type === trader.specialization || 
      item.category === trader.specialization
    ) {
      return Math.round(item.price * (1 - trader.discount));
    }
    
    return item.price;
  };

  // Check if player can afford an item
  const canAfford = (price: number) => player.gold >= price;

  return (
    <div className="black-market-container">
      <div className="black-market-header">
        <h2>The Black Market</h2>
        <div className="black-market-info">
          <p>Current Moon Phase: <span className="moon-phase">{time.phaseName}</span></p>
          <p>Your Gold: <span className="gold-amount">{player.gold}</span></p>
          <p>Your Reputation: <span className="reputation">{player.reputation}</span></p>
        </div>
        
        <div className="black-market-disclaimer">
          <p>Items here are rare and may disappear after purchase. Prices are volatile.</p>
        </div>
      </div>
      
      {availableTraders.length > 0 && (
        <div className="traders-section">
          <button 
            className="toggle-traders"
            onClick={() => setShowTraders(!showTraders)}
          >
            {showTraders ? 'Hide Traders' : 'Show Available Traders'}
          </button>
          
          {showTraders && (
            <div className="traders-list">
              {availableTraders.map(trader => (
                <div 
                  key={trader.id}
                  className={`trader-card ${selectedTrader === trader.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTrader(prev => prev === trader.id ? null : trader.id)}
                >
                  <div className="trader-info">
                    <h3>{trader.name}</h3>
                    <p>Specializes in: <span className="specialization">{trader.specialization}</span></p>
                    <p>Discount: <span className="discount">{trader.discount * 100}%</span> on {trader.specialization}</p>
                  </div>
                  
                  <div className="trader-action">
                    {selectedTrader === trader.id ? (
                      <span className="trading-active">Trading With</span>
                    ) : (
                      <span className="select-trader">Select</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="black-market-items">
        {market.length === 0 ? (
          <div className="empty-market">
            <p>No items are currently available in the black market.</p>
            <p>Check back during different moon phases or as your reputation grows.</p>
          </div>
        ) : (
          <div className="items-grid">
            {market.map(item => {
              const discountedPrice = getDiscountedPrice(item);
              const hasDiscount = discountedPrice < item.price;
              const isAffordable = canAfford(discountedPrice);
              const wasRecentlyPurchased = recentlyPurchased.includes(item.id);
              
              return (
                <div 
                  key={item.id}
                  className={`market-item ${getRarityClass(item.rarity)} ${wasRecentlyPurchased ? 'purchased' : ''}`}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="item-header">
                    <h3 className="item-name">{item.name}</h3>
                    <span className="item-type">{item.type}</span>
                  </div>
                  
                  <div className="item-image">
                    <img 
                      src={`/images/${item.type}s/${item.name.toLowerCase().replace(/\s/g, '_')}.png`} 
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/unknown_item.png';
                      }}
                    />
                    
                    {/* Rarity banner */}
                    {item.rarity && (
                      <div className={`rarity-banner ${getRarityClass(item.rarity)}`}>
                        {item.rarity}
                      </div>
                    )}
                  </div>
                  
                  <div className="item-description">
                    <p>{item.description || `A mysterious ${item.type} of unknown origin.`}</p>
                  </div>
                  
                  <div className="item-price-container">
                    {hasDiscount ? (
                      <>
                        <span className="original-price">{item.price} gold</span>
                        <span className="discounted-price">{discountedPrice} gold</span>
                      </>
                    ) : (
                      formatPrice(item)
                    )}
                  </div>
                  
                  <button
                    className="buy-button"
                    onClick={() => handleBuy(item.id)}
                    disabled={!isAffordable || wasRecentlyPurchased}
                  >
                    {wasRecentlyPurchased ? 'Purchased!' : isAffordable ? 'Buy Now' : 'Not Enough Gold'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="black-market-footer">
        <p>The black market inventory changes with the phases of the moon. Rare items may only appear during specific phases.</p>
        <p>Some traders only appear during certain moon phases and require higher reputation to trade with.</p>
      </div>
    </div>
  );
};

export default BlackMarket;