// backend/src/validate.ts

import {
  Player,
  CropType,
  MarketState,
  Potion,
  RitualQuestCard,
  GameState,
  MarketItem,
} from '../../shared/types';
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
export function validatePlant(
  player: Player,
  slotIndex: number,
  slot: CropType | null
): boolean {
  // must have the crop in inventory
  return slot !== null && player.inventory[slot] > 0;
}

/**
 * Validate if the player can harvest at the given garden slot.
 */
export function validateHarvest(
  player: Player,
  slotIndex: number
): boolean {
  const slot = player.garden[slotIndex];
  return !!slot && slot.growth >= (slot.kind === 'tree' ? 3 : 1);
}

/**
 * Validate if the player can buy a given item from the market.
 */
export function validateBuy(
  player: Player,
  market: MarketState,
  itemId: string,
  quantity: number = 1
): boolean {
  const item = market.items[itemId];
  if (!item) return false;

  const price = item.currentPrice ?? item.price;
  return item.stock >= quantity && player.gold >= price * quantity;
}

/**
 * Validate if the player can sell a given item back to the market.
 */
export function validateSell(
  player: Player,
  market: MarketState,
  itemId: string,
  quantity: number = 1
): boolean {
  // selling crops/ingredients
  if (player.inventory[itemId as CropType] >= quantity) return true;
  // selling potions
  const count = player.potions.filter(p => p.name === itemId).length;
  return count >= quantity;
}

/**
 * Validate if the player can brew a given potion.
 */
export function validateBrew(
     player: Player,
     potionName: string
  ): boolean {
  const recipe = getPotionByName(potionName);
  if (!recipe) return false;
  // check ingredients
  for (const [crop, needed] of Object.entries(
    recipe.ingredients
  ) as [CropType, number][]) {
    if (player.inventory[crop] < needed) return false;
  }
  return true;
}

/**
 * Validate if the player can fulfill a ritual quest.
 */
export function validateFulfill(
  player: Player,
  quest: RitualQuestCard,
  contribution: number
): boolean {
  // ensure quest not already fulfilled
  if (quest.fulfilled) return false;
  // ensure player has enough craft points
  return player.craftPoints >= contribution;
}

/**
 * Validate black-market purchase (risk check).
 */
export function validateBlackMarketBuy(
  player: Player,
  item: MarketItem,
  quantity: number = 1
): boolean {
  if (item.type !== 'blackMarket') return false;
  const price = item.currentPrice ?? item.price;
  // simple risk threshold: player must have renown above riskLevel
  return player.gold >= price * quantity && player.renown >= item.riskLevel;
}

/**
 * Validate a rumor action (e.g., sharing or acting on a rumor).
 * Here we just check that the player hasn't already heard it.
 */
export function validateRumor(
  player: Player,
  rumorId: string
): boolean {
  return !player.rumorsHeard?.includes(rumorId);
}

/**
 * Validate game state before accepting a batch of actions.
 */
export function validateGameState(
  state: GameState
): boolean {
  // Basic sanity: at least one player, market initialized
  return (
    state.players.length > 0 &&
    state.status.year > 0 &&
    Boolean(state.market?.items)
  );
}