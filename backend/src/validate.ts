// src/validate.ts
import type { GameState, TownRequestCard, PotionType, GardenSlot } from "../../shared/types";

const isCropType = (val: any): val is Exclude<PotionType, "fruit"> =>
  val === "mushroom" || val === "flower" || val === "herb";

export function validateHarvest(gameState: GameState): { valid: boolean; state?: GameState; error?: string } {
  const updatedState: GameState = JSON.parse(JSON.stringify(gameState));
  const { spaces } = updatedState.player.garden;

  spaces.forEach((item, index) => {
    if (item && typeof item === "object" && isCropType(item.type)) {
      updatedState.player.inventory[item.type]++;
      updatedState.player.garden.spaces[index] = null;
    }
  });

  return { valid: true, state: updatedState };
}

export function validateBrew(gameState: GameState): string | null {
  return null;
}

export function validateFulfill(gameState: GameState, card: TownRequestCard): string | null {
  for (const key in card.potionNeeds) {
    const needed = card.potionNeeds[key as keyof typeof card.potionNeeds];
    if (gameState.player.potions[key as keyof typeof card.potionNeeds] < needed) {
      return `Not enough ${key} potions.`;
    }
  }
  return null;
}

// 🦢 Validation for planting crops
export function validatePlantCrop(
  gameState: GameState,
  crop: Exclude<PotionType, "fruit">,
  index: number
): { valid: boolean; state?: GameState; error?: string } {
  if (gameState.player.garden.spaces[index]) {
    return { valid: false, error: "Plot already occupied." };
  }
  if (gameState.player.inventory[crop] <= 0) {
    return { valid: false, error: `No ${crop} left to plant.` };
  }

  const updated = structuredClone(gameState);
  updated.player.inventory[crop]--;
  updated.player.garden.spaces[index] = {
    type: crop,
    stage: "young",
    age: 0
  };

  return { valid: true, state: updated };
}

// 🌳 Validation for planting trees (only if there's an empty plot)
export function validatePlantTree(
  gameState: GameState
): { valid: boolean; state?: GameState; error?: string } {
  const index = gameState.player.garden.spaces.findIndex((s) => s === null);
  if (index === -1) {
    return { valid: false, error: "No empty plots for tree." };
  }

  const updated = structuredClone(gameState);
  updated.player.garden.spaces[index] = {
    type: "tree",
    stage: "young",
    age: 0
  };

  return { valid: true, state: updated };
}

export function validateFellTree(gameState: GameState, index: number): GameState | string | null {
  const slot = gameState.player.garden.spaces[index];
  if (!slot || typeof slot !== "object" || slot.type !== "tree") return "No tree here.";
  const updated = structuredClone(gameState);
  updated.player.garden.spaces[index] = null;
  return updated;
}

export function validateBuy(gameState: GameState): string | null {
  return null;
}

export function validateSell(gameState: GameState): string | null {
  return null;
}

export function validateUpgrade(gameState: GameState): string | null {
  return null;
}

export function validateAdvance(gameState: GameState): string | null {
  return null;
}