import { v4 as uuidv4 } from "uuid";
import type { TownRequestCard, PotionIngredient, Season } from "@shared/types";

/**
 * Generate an array of TownRequestCard objects for the new season.
 * For demo purposes, generates 3 requests with random required ingredients.
 */
export function generateTownRequests(): TownRequestCard[] {
  const ingredients: PotionIngredient[] = ["herb", "flower", "mushroom", "fruit"];
  const seasons: Season[] = ["spring", "summer", "autumn", "winter"];

  return Array.from({ length: 3 }, (_, i) => {
    const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
    const randomSeason = seasons[Math.floor(Math.random() * seasons.length)];

    const potionNeeds: Record<PotionIngredient, number> = {
      herb: 0,
      flower: 0,
      mushroom: 0,
      fruit: 0
    };
    potionNeeds[randomIngredient] = 1;

    const card: TownRequestCard = {
      id: uuidv4(),
      description: `Deliver 1 ${randomIngredient} potion`,
      reward: { gold: 10 },
      boardSlot: ((i % 3) + 1) as 1 | 2 | 3,
      potionNeeds,
      craftPoints: 1,
      fulfilled: false,
      season: randomSeason
    };

    return card;
  });
}
