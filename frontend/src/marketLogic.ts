import { Player } from '../../../shared/types';
import { MarketState, CropType } from './Market';

export function buyFromMarket(player: Player, market: MarketState, type: CropType, qty: number) {
  const item = market.items[type];
  if (item.stock < qty) throw new Error('Not enough stock');
  const cost = item.price * qty;
  if (player.gold < cost) throw new Error('Not enough gold');

  player.gold -= cost;
  player.inventory[type] += qty;
  item.stock -= qty;
  item.price = Math.min(item.price + 1, 5);
  item.trend = 'up';
}

export function sellToMarket(player: Player, market: MarketState, type: CropType, qty: number) {
  if (player.inventory[type] < qty) throw new Error('Not enough inventory');
  const gain = market.items[type].price * qty;

  player.inventory[type] -= qty;
  player.gold += gain;
  market.items[type].stock += qty;
  market.items[type].price = Math.max(market.items[type].price - 1, 1);
  market.items[type].trend = 'down';
}
