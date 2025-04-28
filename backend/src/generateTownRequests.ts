// backend/src/generateTownRequests.ts – Ensure up to 3 town requests are active
import { v4 as uuidv4 } from 'uuid';
import type { TownRequestCard, PotionIngredient, GameStatus } from '../../shared/src/types';

/**
 * Maintain up to 3 active town requests.
 * Remove fulfilled ones, then generate new requests tied to the current season.
 */
export function generateTownRequests(existing: TownRequestCard[], status: GameStatus): TownRequestCard[] {
  // Keep only unfulfilled requests
  const active = existing.filter(r => !r.fulfilled);

  // Fill up to 3 active request cards
  while (active.length < 3) {
    const ingredients: PotionIngredient[] = ['herb', 'flower', 'mushroom', 'fruit'];
    const choice = ingredients[Math.floor(Math.random() * ingredients.length)];
    const newCard: TownRequestCard = {
      id: uuidv4(),
      potionNeeds: { herb: 0, flower: 0, mushroom: 0, fruit: 0, [choice]: 1 },
      craftPoints: 1,
      boardSlot: ((active.length % 4) + 1) as 1 | 2 | 3 | 4,
      fulfilled: false,
      description: `Deliver 1 ${choice} potion`,
      reward: { gold: 10, renown: 1, craftPoints: 0 },
      season: status.season,
    };
    active.push(newCard);
  }

  return active;
}