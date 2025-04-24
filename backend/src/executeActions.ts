// backend/executeActions.ts
import type { GameState } from "../../shared/types";
import type { Action } from "../../shared/actionTypes";
import { canUseAction, incrementActionsUsed } from "./canUseAction";
import {
  plantCrop,
  harvestCrop,
  fellTree,
  plantTree,
  waterCrop
} from "./gardenLogic";
import {
  validateBrew,
  validateFulfill,
  validateBuy,
  validateSell,
  validateUpgrade
} from "./validate";

export function executeActions(originalState: GameState, actions: Action[]): GameState {
  let newState = structuredClone(originalState);

  for (const action of actions) {
    try {
      switch (action.type) {
        case "plant":
          if (!canUseAction(newState)) {
            newState.player.alerts.push("❌ You've already used 2 actions this moon.");
            break;
          }
          if (action.itemType === "fruit") {
            newState.player = plantTree(newState.player, action.plotIndex);
          } else {
            newState.player = plantCrop(newState.player, action.itemType, action.plotIndex);
          }
          newState = incrementActionsUsed(newState);
          break;

        case "harvest":
          if (!canUseAction(newState)) {
            newState.player.alerts.push("❌ You've already used 2 actions this moon.");
            break;
          }
          newState.player = harvestCrop(newState.player, action.plotIndex);
          newState = incrementActionsUsed(newState);
          break;

        case "fell":
          if (!canUseAction(newState)) {
            newState.player.alerts.push("❌ You've already used 2 actions this moon.");
            break;
          }
          newState.player = fellTree(newState.player, action.plotIndex);
          newState = incrementActionsUsed(newState);
          break;

        case "water":
          if (!canUseAction(newState)) {
            newState.player.alerts.push("❌ You've already used 2 actions this moon.");
            break;
          }
          newState.player = waterCrop(newState.player, action.plotIndex);
          newState = incrementActionsUsed(newState);
          break;

        case "brew": {
          const validation = validateBrew(newState);
          if (typeof validation === "string") {
            newState.player.alerts.push(`❌ ${validation}`);
          } else {
            newState.player.alerts.push("🧪 Brewed a potion.");
          }
          break;
        }

        case "fulfill": {
          const validation = validateFulfill(newState, action.requestId);
          if (typeof validation === "string") {
            newState.player.alerts.push(`❌ ${validation}`);
          } else {
            newState.player.alerts.push("📦 Fulfilled a town request!");
          }
          break;
        }

        case "buy": {
          const validation = validateBuy(newState, action.item, action.quantity);
          if (typeof validation === "string") {
            newState.player.alerts.push(`❌ ${validation}`);
          } else {
            newState.player.alerts.push(`🛒 Bought ${action.quantity} ${action.item}`);
          }
          break;
        }

        case "sell": {
          const validation = validateSell(newState, action.item, action.quantity);
          if (typeof validation === "string") {
            newState.player.alerts.push(`❌ ${validation}`);
          } else {
            newState.player.alerts.push(`💰 Sold ${action.quantity} ${action.item}`);
          }
          break;
        }

        case "upgrade": {
          const validation = validateUpgrade(newState, action.upgradeId);
          if (typeof validation === "string") {
            newState.player.alerts.push(`❌ ${validation}`);
          } else {
            newState.player.alerts.push(`🛠️ Upgraded ${action.upgradeId}`);
          }
          break;
        }

        case "advance":
          // No-op here: advance happens in turnEngine
          newState.player.alerts.push("🌙 Waiting to end the turn.");
          break;

        default:
          newState.player.alerts.push(`❌ Unknown action: ${(action as any).type}`);
          break;
      }
    } catch (err: any) {
      newState.player.alerts.push(`❌ Error: ${err.message || err.toString()}`);
    }
  }

  return newState;
}