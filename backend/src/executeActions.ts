// backend/src/executeActions.ts
import type { GameState } from "../../shared/types";
import type { Action } from "../../shared/actionTypes";
import { plantCrop } from "./gardenLogic";
import { harvestCrop } from "./gardenLogic";
import { fellTree } from "./gardenLogic";
import { incrementActionsUsed } from "./canUseAction";
import { plantTree } from "./gardenLogic";
import type { GardenSlot } from "../../shared/types";

export function executeActions(gameState: GameState, actions: Action[]): GameState {
    let newState = structuredClone(gameState);

  for (const action of actions) {
    try {
      switch (action.type) {
        case "plant":
            if (action.itemType === "fruit") {
                newState.player = plantTree(newState.player, action.plotIndex);
              } else {
                newState.player = plantCrop(newState.player, action.itemType, action.plotIndex);
              }              
          newState = incrementActionsUsed(newState);
          break;
        case "harvest":
          newState.player = harvestCrop(newState.player, [action.plotIndex]);
          newState = incrementActionsUsed(newState);
          break;
        case "fell":
          newState.player = fellTree(newState.player, action.plotIndex);
          newState = incrementActionsUsed(newState);
          break;
        default:
          newState.player.alerts?.push(`❌ Unknown action type: ${action.type}`);
      }
    } catch (err: any) {
      newState.player.alerts?.push(`❌ Action failed: ${err.message}`);
    }
  }

  return newState;
}