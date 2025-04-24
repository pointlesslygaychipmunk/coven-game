import { plantCrop, plantTree } from "./gardenLogic";
import type { GameState } from "../../shared/types";
import type { Action } from "../../shared/actionTypes";

export function executeActions(gameState: GameState, actions: Action[] = []): GameState {
    let newState = { ...gameState };
  
    if (!Array.isArray(actions)) {
      console.warn("Invalid actions received:", actions);
      return newState;
    }
  
    for (const action of actions) {
      if (!action || typeof action.type !== "string") {
        console.warn("Skipping invalid action:", action);
        continue;
      }
  
      switch (action.type) {
        case "plant":
          if (action.itemType === "fruit") {
            newState.player = plantTree(newState.player, action.plotIndex);
          } else {
            newState.player = plantCrop(newState.player, action.itemType, action.plotIndex);
          }
          break;
  
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }
    }
  
    return newState;
  }  