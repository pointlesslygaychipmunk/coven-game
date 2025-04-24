import { plantCrop } from "./gardenLogic";
import type { GameState } from "../../shared/types";

export type Action = PlantAction;

interface PlantAction {
  type: "plant";
  plotIndex: number;
  itemType: "mushroom" | "flower" | "herb" | "fruit";
}

// Add more action interfaces here as needed

type Action = PlantAction;

export function executeActions(gameState: GameState, actions: Action[]): GameState {
  let newState = { ...gameState };

  for (const action of actions) {
    switch (action.type) {
      case "plant":
        newState = plantCrop(newState, {
          plotIndex: action.plotIndex,
          itemType: action.itemType
        });
        break;
      // Add more case branches here for new actions
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  return newState;
}