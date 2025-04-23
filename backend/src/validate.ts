// src/validate.ts
import type { GameState, TownRequestCard } from "../../shared/types";

export function validatePlantCrop(gameState: GameState, type: string, index: number): string | null {
  if (index < 0 || index >= gameState.player.garden.spaces.length) return "Invalid garden index.";
  if (gameState.player.garden.spaces[index] !== null) return "Plot already occupied.";
  if ((gameState.player.inventory as any)[type] < 1) return `Not enough ${type}s in inventory.`;
  return null;
}

export function validateHarvest(gameState: GameState): string | null {
  // Assume always valid for now
  return null;
}

export function validateBrew(gameState: GameState): string | null {
  // Assume always valid for now
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

export function validatePlantTree(gameState: GameState, index: number): string | null {
  if (index < 0 || index >= gameState.player.garden.spaces.length) return "Invalid plot index.";
  if (gameState.player.garden.spaces[index] !== null) return "Plot already occupied.";
  return null;
}

export function validateFellTree(gameState: GameState, index: number): string | null {
  const slot = gameState.player.garden.spaces[index];
  if (!slot || "type" in slot) return "No tree here.";
  return null;
}

export function validateBuy(gameState: GameState): string | null {
  // Placeholder for actual market rules
  return null;
}

export function validateSell(gameState: GameState): string | null {
  // Placeholder for actual inventory rules
  return null;
}

export function validateUpgrade(gameState: GameState): string | null {
  // Placeholder: you could enforce upgrade cost or limits here
  return null;
}

export function validateAdvance(gameState: GameState): string | null {
  // Placeholder: ensure it’s not already game over, etc.
  return null;
}
