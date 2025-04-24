import type { GameState, GardenSlotObject, GardenSlot } from "../../shared/types";

export type CropType = "mushroom" | "flower" | "herb" | "fruit";

interface PlantParams {
  plotIndex: number;
  itemType: CropType;
}

export function canPlantCrop(gameState: GameState, { plotIndex, itemType }: PlantParams): boolean {
  const plot = gameState.player.garden.spaces[plotIndex];
  if (plot !== null) return false; // Can't plant on a non-empty plot
  if (!gameState.player.inventory[itemType] || gameState.player.inventory[itemType] < 1) return false; // Must have the item
  return true;
}

export function plantCrop(gameState: GameState, { plotIndex, itemType }: PlantParams): GameState {
  if (!canPlantCrop(gameState, { plotIndex, itemType })) {
    throw new Error("Cannot plant crop here.");
  }

  const newPlot: GardenSlotObject = {
    kind: "tree",
    growth: 1,
    isDead: false,
  };   

  const newSpaces: GardenSlot[] = [...gameState.player.garden.spaces];
  newSpaces[plotIndex] = newPlot;

  return {
    ...gameState,
    player: {
      ...gameState.player,
      inventory: {
        ...gameState.player.inventory,
        [itemType]: gameState.player.inventory[itemType] - 1
      },
      garden: {
        ...gameState.player.garden,
        spaces: newSpaces
      }
    }
  };
}