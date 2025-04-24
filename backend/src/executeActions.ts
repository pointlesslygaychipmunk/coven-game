import type { GameState } from "../../shared/types";
import type { Action } from "../../shared/actionTypes";
import { plantCrop, plantTree, fellTree, harvestCrop } from "./gardenLogic";
import { canUseAction, incrementActionsUsed } from "./canUseAction";

export function executeActions(gameState: GameState, actions: Action[]): GameState {
  let newState = structuredClone(gameState);

  for (const action of actions) {
    if (!canUseAction(newState)) {
      newState.player.alerts?.push("❌ You've already used 2 actions this moon.");
      break;
    }

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
          newState.player.alerts?.push(`❌ Unknown action: ${action.type}`);
      }
    } catch (err: any) {
      newState.player.alerts?.push(`❌ Action failed: ${err.message}`);
    }
  }

  return newState;
}