// src/validate.ts
import type {
  GameState,
  TownRequestCard,
  PotionType,
  GardenSlot,
  CropType,
} from "../../shared/types";

const isCropType = (val: any): val is Exclude<PotionType, "fruit"> =>
  val === "mushroom" || val === "flower" || val === "herb";

// 🌿 Harvest crops that are ready and not dead
export function validateHarvest(gameState: GameState): { valid: boolean; state?: GameState; error?: string } {
  const updatedState: GameState = structuredClone(gameState);
  const thresholds: Record<Exclude<PotionType, "fruit">, number> = {
    mushroom: 4,
    flower: 3,
    herb: 2,
  };

  updatedState.player.garden.spaces.forEach((slot, index) => {
    if (slot && slot.kind === "crop" && !slot.isDead && slot.growth >= thresholds[slot.type]) {
      updatedState.player.inventory[slot.type]++;
      updatedState.player.garden.spaces[index] = null;
    }
  });

  return { valid: true, state: updatedState };
}

// 🧪 Brew potions (no validation for now)
export function validateBrew(gameState: GameState): string | null {
  return null;
}

// 🧳 Fulfill request if enough potions
export function validateFulfill(gameState: GameState, card: TownRequestCard): string | null {
  for (const key in card.potionNeeds) {
    const needed = card.potionNeeds[key as keyof typeof card.potionNeeds];
    if (gameState.player.potions[key as keyof typeof card.potionNeeds] < needed) {
      return `Not enough ${key} potions.`;
    }
  }
  return null;
}

// 🧑‍🌾 Plant a crop in a specific empty plot
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
    kind: "crop",
    type: crop,
    growth: 1,
    isDead: false,
  };

  return { valid: true, state: updated };
}

// 🌲 Plant a tree if any space is empty
export function validatePlantTree(
  gameState: GameState
): { valid: boolean; state?: GameState; error?: string } {
  const index = gameState.player.garden.spaces.findIndex((s) => s === null);
  if (index === -1) {
    return { valid: false, error: "No empty plots for tree." };
  }

  const updated = structuredClone(gameState);
  updated.player.garden.spaces[index] = {
    kind: "tree",
    growth: 1,
    isDead: false,
  };

  return { valid: true, state: updated };
}

// 🪓 Fell a tree from a specific index
export function validateFellTree(gameState: GameState, index: number): GameState | string | null {
  const slot = gameState.player.garden.spaces[index];
  if (!slot || slot.kind !== "tree") return "No tree here.";
  const updated = structuredClone(gameState);
  updated.player.garden.spaces[index] = null;
  return updated;
}

// 🛍️ Placeholder stubs for future logic
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