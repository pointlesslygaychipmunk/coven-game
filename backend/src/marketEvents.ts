// backend/src/marketEvents.ts
// Handles periodic market adjustments, including memory decay towards
// base prices, rumor impacts, and seasonal fluctuations.

import { GameState, MarketItem, Rumor, Season, MoonPhase } from "@shared/types";

// Adjust prices based on supply and demand
function adjustPricesBySupplyAndDemand(state: GameState): void {
  state.market.forEach(item => {
    const demand = state.marketData.demand[item.name] || 50;
    const supply = state.marketData.supply[item.name] || 50;
    
    // Calculate market pressure (-1.0 to 1.0)
    // Positive = prices rise, Negative = prices fall
    const marketPressure = (demand - supply) / 100;
    
    // Apply pressure-based price change (up to +/- 5% per turn)
    const maxChange = 0.05;
    const volatilityMultiplier = item.volatility || 1.0;
    const priceChangePercent = marketPressure * maxChange * volatilityMultiplier;
    
    // Apply the change to the current price
    const newPrice = Math.round(item.price * (1 + priceChangePercent));
    
    // Ensure price doesn't go too low
    item.price = Math.max(1, newPrice);
    
    // Track when price was last changed
    item.lastPriceChange = state.time.dayCount;
    
    // Optional: Track price history
    if (item.priceHistory) {
      item.priceHistory.push(item.price);
      
      // Keep history to a reasonable size
      if (item.priceHistory.length > 30) {
        item.priceHistory.shift(); // Remove oldest price
      }
    } else {
      item.priceHistory = [item.price];
    }
  });
}

// Apply price memory - prices gradually revert to base price over time
function applyPriceMemory(state: GameState): void {
  state.market.forEach(item => {
    const base = item.basePrice;
    if (item.price === base) return; // Already at base price
    
    const daysSinceLastChange = state.time.dayCount - (item.lastPriceChange || 0);
    
    // After several days without activity, price starts reverting to base
    if (daysSinceLastChange > 3) {
      const revertStrength = Math.min(0.3, 0.05 * (daysSinceLastChange - 3)); // 5-30% reversion
      
      if (item.price > base) {
        // If price above base, let price fall towards base
        const drop = Math.ceil((item.price - base) * revertStrength);
        item.price = Math.max(base, item.price - drop);
      } else if (item.price < base) {
        // If price below base, let price rise towards base
        const rise = Math.ceil((base - item.price) * revertStrength);
        item.price = Math.min(base, item.price + rise);
      }
    }
  });
}

// Apply moon phase effects on market prices
function applyMoonPhaseEffects(state: GameState): void {
  const currentPhase = state.time.phaseName;
  
  // Different moon phases affect different item categories
  const moonEffects: Record<MoonPhase, {
    category: string,
    effect: number  // multiplier
  }> = {
    "New Moon": { category: "potion", effect: 0.9 },  // Potions less effective
    "Waxing Crescent": { category: "seed", effect: 1.1 }, // Good for planting
    "First Quarter": { category: "tool", effect: 1.05 },
    "Waxing Gibbous": { category: "seed", effect: 1.15 }, // Very good for planting
    "Full Moon": { category: "potion", effect: 1.2 },  // Potions most powerful
    "Waning Gibbous": { category: "ingredient", effect: 1.1 }, // Good harvesting
    "Last Quarter": { category: "ritual_item", effect: 1.1 },
    "Waning Crescent": { category: "ingredient", effect: 0.95 } // Ingredients losing potency
  };
  
  // Apply the effect if defined for current phase
  const effect = moonEffects[currentPhase];
  if (effect) {
    state.market.forEach(item => {
      if (item.type === effect.category) {
        // Apply the moon phase effect to item price
        item.price = Math.max(1, Math.round(item.price * effect.effect));
      }
    });
  }
  
  // Special case for Full Moon - certain rare items only appear during this phase
  if (currentPhase === "Full Moon") {
    // Check if certain rare items are already in the market
    const moonRareItems = [
      {
        id: "moon_essence",
        name: "Lunar Essence",
        type: "ingredient",
        category: "essence",
        description: "A rare essence that can only be harvested during the Full Moon.",
        rarity: "rare",
        basePrice: 80,
        price: 80
      },
      {
        id: "moonglow_crystal",
        name: "Moonglow Crystal",
        type: "ritual_item",
        category: "crystal",
        description: "A luminous crystal that glows with moonlight.",
        rarity: "rare",
        basePrice: 120,
        price: 120
      }
    ];
    
    // Add rare items if they don't exist
    moonRareItems.forEach(rareItem => {
      if (!state.market.some(item => item.id === rareItem.id)) {
        state.market.push(rareItem);
      }
    });
  } else {
    // Remove Full Moon exclusive items when not Full Moon
    state.market = state.market.filter(item => 
      item.id !== "moon_essence" && item.id !== "moonglow_crystal"
    );
  }
}

// Apply seasonal effects on market prices
function applySeasonalEffects(state: GameState): void {
  const currentSeason = state.time.season;
  
  // Define seasonal effects on different item categories
  const seasonalEffects: Record<Season, Record<string, number>> = {
    "Spring": {
      "seed": 1.2,        // Seeds more valuable in spring
      "herb": 0.9,        // Herbs abundant in spring
      "flower": 0.85      // Flowers abundant in spring
    },
    "Summer": {
      "fruit": 0.85,      // Fruits abundant in summer
      "flower": 1.0,      // Flowers normal in summer
      "herb": 1.1         // Some herbs scarcer in summer heat
    },
    "Fall": {
      "herb": 0.9,        // Many herbs ready for harvest
      "mushroom": 0.8,    // Mushrooms abundant in fall
      "seed": 0.9         // Seeds cheaper as plants go to seed
    },
    "Winter": {
      "herb": 1.2,        // Herbs scarce in winter
      "root": 1.1,        // Roots harder to harvest
      "seed": 1.1,        // Seeds more valuable as spring approaches
      "potion": 1.15      // Potions valuable in winter
    }
  };
  
  // Apply effects based on item category
  const effects = seasonalEffects[currentSeason];
  if (effects) {
    state.market.forEach(item => {
      const categoryEffect = effects[item.category];
      if (categoryEffect) {
        // Apply the seasonal effect to item price
        item.price = Math.max(1, Math.round(item.price * categoryEffect));
      }
    });
  }
}

// Apply effects of rumors on market prices
function applyRumorEffects(state: GameState): void {
  // Only process active rumors
  const activeRumors = state.rumors.filter(rumor => rumor.spread > 0);
  
  activeRumors.forEach(rumor => {
    if (!rumor.affectedItem || !rumor.priceEffect) return;
    
    // Find items affected by this rumor
    const affectedItems = state.market.filter(item => 
      item.name === rumor.affectedItem || 
      item.category === rumor.affectedItem || 
      item.type === rumor.affectedItem
    );
    
    // Apply price effect based on rumor spread (0-100)
    const effectStrength = (rumor.spread / 100) * rumor.priceEffect;
    
    affectedItems.forEach(item => {
      item.price = Math.max(1, Math.round(item.price * (1 + effectStrength)));
    });
  });
}

// Handle black market price updates (separate from regular market)
function updateBlackMarketPrices(state: GameState): void {
  // Black market only relevant if unlocked
  if (!state.marketData.blackMarketUnlocked) return;
  
  state.market.forEach(item => {
    // Only apply to black market items
    if (!item.blackMarketOnly) return;
    
    // Black market prices are more volatile
    const volatility = 0.15; // 15% baseline volatility
    const randomFactor = (Math.random() * 2 - 1) * volatility; // -15% to +15%
    
    // Apply random fluctuation
    item.price = Math.max(1, Math.round(item.price * (1 + randomFactor)));
    
    // Black market prices don't follow normal economic rules as strictly
    // They can drift much higher or lower than base price
  });
}

// Adjust inflation factor based on trading volume
function updateInflation(state: GameState): void {
  // If trading volume is high, slight inflation occurs
  // If trading volume is low, slight deflation occurs
  const previousInflation = state.marketData.inflation;
  const tradingVolume = state.marketData.tradingVolume;
  
  // Reset trading volume for next phase
  state.marketData.tradingVolume = 0;
  
  // Baseline inflation/deflation rate (very small)
  const baseRate = 0.002; // 0.2% per turn
  
  // Determine if inflation or deflation based on trade volume
  const volumeThreshold = 100; // Arbitrary threshold for this example
  let inflationChange = 0;
  
  if (tradingVolume > volumeThreshold) {
    // High trading volume causes inflation
    inflationChange = baseRate * (tradingVolume / volumeThreshold);
  } else if (tradingVolume < volumeThreshold / 2) {
    // Low trading volume causes deflation
    inflationChange = -baseRate * (1 - (tradingVolume / (volumeThreshold / 2)));
  }
  
  // Apply change with limits
  state.marketData.inflation = Math.min(1.5, Math.max(0.7, previousInflation + inflationChange));
  
  // Apply global inflation to all base prices
  if (state.marketData.inflation !== 1.0) {
    state.market.forEach(item => {
      // Gradually adjust base prices based on inflation
      const inflationAdjustment = (state.marketData.inflation - 1) * 0.1;
      item.basePrice = Math.max(1, Math.round(item.basePrice * (1 + inflationAdjustment)));
    });
  }
}

// Main function to apply all market events
export function applyMarketEvents(state: GameState): void {
  // First adjust prices based on supply and demand
  adjustPricesBySupplyAndDemand(state);
  
  // Apply price memory effect (reversion to base price)
  applyPriceMemory(state);
  
  // Apply moon phase effects
  applyMoonPhaseEffects(state);
  
  // Apply seasonal effects
  applySeasonalEffects(state);
  
  // Apply rumor effects
  applyRumorEffects(state);
  
  // Update black market
  updateBlackMarketPrices(state);
  
  // Update inflation
  updateInflation(state);
}