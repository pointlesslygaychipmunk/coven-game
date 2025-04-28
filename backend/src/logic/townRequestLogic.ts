// backend/src/logic/townRequestLogic.ts

import { v4 as uuidv4 } from "uuid";
import {
  TownRequestCard,
  PotionIngredient,
  GameStatus
} from "../../.././shared/types";

/**
 * Maintain up to 3 active town requests.
 * Remove fulfilled, then generate new ones tied to current season.
 */
export function generateTownRequests(
  existing: TownRequestCard[],
  status: GameStatus
): TownRequestCard[] {
  // Keep only unfulfilled
  const active = existing.filter((r) => !r.fulfilled);

  // Fill to three cards
  while (active.length < 3) {
    const ingredients: PotionIngredient[] = [
      "herb",
      "flower",
      "mushroom",
      "fruit",
    ];
    const choice =
      ingredients[Math.floor(Math.random() * ingredients.length)];

    const card: TownRequestCard = {
      id: uuidv4(),
      potionNeeds: {
        herb: 0,
        flower: 0,
        mushroom: 0,
        fruit: 0,
        [choice]: 1,
      },
      craftPoints: 1,
      boardSlot: ((active.length % 4) + 1) as 1 | 2 | 3 | 4,
      fulfilled: false,
      description: `Deliver 1 ${choice} potion`,
      reward: { gold: 10, renown: 1, craftPoints: 0 },
      season: status.season,
    };
    active.push(card);
  }

  return active;
}