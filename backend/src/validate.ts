// backend/src/validate.ts

import { GameState, Player, MarketState, MarketItem, Potion, CropType } from '../../shared/types';
import { getPotionByName } from './potions';

/**
 * Validate if the player can use the watering action.
 */
export function validateWater(player: Player): boolean {
  return player.wateringUsed < 3;
}

/**
 * Validate if the player can plant a given crop.
 */
export function validatePlant(player: Player, crop: CropType): boolean {
  return player.inventory[crop] > 0;
}

/**
 * Validate if a specific garden slot can be harvested.
 */
export function validateHarvest(slot: number, garden: Player['garden']): boolean {
  return slot >= 0 && slot < garden.length && garden[slot].growth >= 3;
}

/**
 * Validate if the player can brew a specific potion based on their inventory.
 */
export function validateBrew(player: Player, potionName: string): boolean {
  const potion = getPotionByName(potionName);
  if (!potion) return false;

  for (const [ingredient, amount] of Object.entries(potion.ingredients)) {
    if ((player.inventory[ingredient as CropType] ?? 0) < amount) {
      return false;
    }
  }
  return true;
}

/**
 * Validate if the player owns the potion they are trying to sell.
 */
export function validateSell(player: Player, potionName: string): boolean {
  return player.potions.some(p => p.name === potionName);
}

/**
 * Validate if the player can buy a given item from the market.
 */
export function validateBuy(player: Player, market: MarketState, itemId: string): boolean {
  const item = market[itemId as keyof MarketState];
  return !!item && typeof item.currentPrice === 'number' && player.gold >= item.currentPrice;
}