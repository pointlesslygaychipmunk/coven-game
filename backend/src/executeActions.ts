import { plantCrop, plantTree } from "./gardenLogic";
import type { GameState } from "../../shared/types";
import type { Action } from "../../shared/actionTypes";

export function executeActions(gameState: GameState, actions: Action[]): GameState {
  let newState = { ...gameState };

  for (const action of actions) {
    switch (action.type) {
      case "plant":
        if (action.itemType === "fruit") {
          newState.player = plantTree(newState.player, action.plotIndex);
        } else {
            newState.player = plantCrop(newState.player, action.itemType, action.plotIndex);
        }
        break;

      // add more cases here

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  return newState;
}