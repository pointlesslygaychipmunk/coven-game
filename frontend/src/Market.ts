export type CropType = 'mushroom' | 'flower' | 'herb' | 'fruit';

export interface MarketItem {
  type: CropType;
  price: number;
  stock: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MarketState {
  items: Record<CropType, MarketItem>;
}

export function createInitialMarket(): MarketState {
  return {
    items: {
      mushroom: { type: 'mushroom', price: 2, stock: 5, trend: 'stable' },
      flower: { type: 'flower', price: 3, stock: 5, trend: 'stable' },
      herb: { type: 'herb', price: 2, stock: 5, trend: 'stable' },
      fruit: { type: 'fruit', price: 4, stock: 5, trend: 'stable' }
    }
  };
}
