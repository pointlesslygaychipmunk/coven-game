import { v4 as uuidv4 } from "uuid";
import type { TownRequestCard } from "../../shared/types";

export function generateTownRequests(): TownRequestCard[] {
  const slots: (1 | 2 | 3)[] = [1, 2, 3];
  const generateNeeds = (): Record<"mushroom" | "flower" | "herb" | "fruit", number> => ({
    mushroom: Math.floor(Math.random() * 2),
    flower: Math.floor(Math.random() * 2),
    herb: Math.floor(Math.random() * 2),
    fruit: Math.floor(Math.random() * 2),
  });

  return slots.map((slot) => {
    const potionNeeds = generateNeeds();
    const total = Object.values(potionNeeds).reduce((a, b) => a + b, 0);
    return {
      id: uuidv4(),
      potionNeeds,
      boardSlot: slot,
      craftPoints: Math.floor(Math.random() * 5) + 1,
      reward: {
        gold: 1 + (4 - slot),
        renown: 2 - slot,
      },
      fulfilled: false,
      type: "standard",   // <- required field
      count: total        // <- required field
    };
  });
}