import type { GameState } from "../../shared/types";
import type { Action } from "../../shared/actionTypes";

import {
  validateHarvest,
  validatePlantCrop,
  validatePlantTree,
  validateFellTree,
  validateWater,
  validateBrew,
  validateFulfill,
  validateBuy,
  validateSell,
  validateUpgrade,
  validateAdvance,
} from "./validate";

export function executeActions(gameState: GameState, actions: Action[]): GameState {
  let currentState = structuredClone(gameState);

  for (const action of actions) {
    let result;

    switch (action.type) {
      case "plant":
        result = validatePlantCrop(currentState, action.crop, action.index);
        break;

      case "plant-tree":
        result = validatePlantTree(currentState, action.index);
        break;

      case "fell-tree":
        result = validateFellTree(currentState, action.index);
        break;

      case "harvest":
        result = validateHarvest(currentState);
        break;

      case "water":
        // For now, always try to water slot 0 (adapt if needed)
        result = validateWater(currentState, 0);
        break;

      case "brew":
        result = validateBrew(currentState, action.potion);
        break;

      case "fulfill":
        const card = currentState.townRequests.find(c => c.id === action.requestId);
        if (!card) {
          currentState.player.alerts?.push(`❌ Invalid request ID: ${action.requestId}`);
          continue;
        }
        result = validateFulfill(currentState, card);
        break;

      case "buy":
        result = validateBuy(currentState, action.item, action.quantity ?? 1);
        break;

      case "sell":
        result = validateSell(currentState, action.item, action.quantity ?? 1);
        break;

      case "upgrade":
        result = validateUpgrade(currentState, action.upgraded);
        break;

      case "advance":
        result = validateAdvance(currentState);
        break;

      default:
        currentState.player.alerts?.push(`❌ Unknown action type: ${(action as any).type}`);
        continue;
    }

    if (!result.valid) {
      currentState.player.alerts?.push(`❌ Action failed: ${result.error}`);
    } else {
      currentState = result.state;
      currentState.actionsUsed += 1;
    }
  }

  return currentState;
}