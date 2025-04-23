import { TownRequestCard } from "../../shared/types";
import { v4 as uuidv4 } from "uuid";

const potionTypes = ["mushroom", "flower", "herb", "fruit"] as const;

type PotionKey = typeof potionTypes[number];

export function generateTownRequests(count: number = 4): TownRequestCard[] {
  const requests: TownRequestCard[] = [];

  for (let i = 1; i <= count; i++) {
    const needs: Record<PotionKey, number> = {
      mushroom: 0,
      flower: 0,
      herb: 0,
      fruit: 0
    };

    // Generate between 1 and 3 potion types with random counts
    const typesUsed = getRandomElements(potionTypes, randomInt(1, 3));
    for (const type of typesUsed) {
      needs[type] = randomInt(1, 3); // 1–2 potions each
    }

    // Get dominant type and count for sorting
    const dominantType = typesUsed[0];
    const totalCount = Object.values(needs).reduce((a, b) => a + b, 0);

    // Assign a board slot and reward based on that slot
    const boardSlot = i as 1 | 2 | 3 | 4;
    const reward = getSlotReward(boardSlot);

    const card: TownRequestCard = {
      id: uuidv4(),
      potionNeeds: needs,
      type: dominantType,
      count: needs[dominantType],
      boardSlot,
      craftPoints: totalCount + reward.renown, // example formula
      reward,
      fulfilled: false
    };

    requests.push(card);
  }

  return requests;
}

// Helpers
function getRandomElements<T>(arr: readonly T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSlotReward(slot: 1 | 2 | 3 | 4): { gold: number; renown: number } {
  switch (slot) {
    case 1: return { gold: 4, renown: 2 };
    case 2: return { gold: 3, renown: 1 };
    case 3: return { gold: 2, renown: -1 };
    case 4: return { gold: 1, renown: -2 };
  }
}