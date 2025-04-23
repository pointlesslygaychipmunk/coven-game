import { v4 as uuidv4 } from "uuid";
import { TownRequestCard } from "../../shared/types"; // or wherever it's defined

const potionTypes = ['mushroom', 'flower', 'herb', 'fruit'] as const;

export function generateTownRequests(): TownRequestCard[] {
  return Array.from({ length: 3 }, (_, i) => {
    const type = potionTypes[Math.floor(Math.random() * potionTypes.length)];
    const count = 3 + Math.floor(Math.random() * 3); // 3–5 of that type

    return {
      id: uuidv4(),
      type,
      count,
      potionNeeds: {
        mushroom: 0,
        flower: 0,
        herb: 0,
        fruit: 0,
        [type]: count
      },
      boardSlot: (i + 1) as 1 | 2 | 3,
      craftPoints: Math.floor(Math.random() * 3),
      reward: {
        gold: 2 + Math.floor(Math.random() * 5),
        renown: 1 + Math.floor(Math.random() * 2),
      },
      fulfilled: false,
    };
  });
}