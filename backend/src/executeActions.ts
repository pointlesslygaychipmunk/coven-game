// backend/executeActions.ts

import type { GameState, PlayerAction } from "../../shared/types";

function applyWater(state: GameState): GameState {
    const garden = state.player.garden.spaces.map((slot) => {
      if (!slot || typeof slot !== 'object') return slot;
      return { ...slot, age: slot.age + 1 };
    });
  
    state.player.garden.spaces = garden;
    state.player.alerts?.push("💧 You watered your crops. Everything grows faster!");
    return state;
  }  

function applyHarvest(state: GameState): GameState {
  state.player.alerts?.push("🌾 You harvested mature crops.");
  return state;
}

function applyBrew(state: GameState): GameState {
  state.player.alerts?.push("🧪 You brewed potions.");
  return state;
}

function applyPlant(state: GameState): GameState {
  state.player.alerts?.push("🌱 You planted something.");
  return state;
}

function applyBuy(state: GameState): GameState {
  state.player.alerts?.push("🛒 You bought ingredients.");
  return state;
}

function applySell(state: GameState): GameState {
  state.player.alerts?.push("💰 You sold goods at the market.");
  return state;
}

function applyUpgrade(state: GameState): GameState {
  state.player.alerts?.push("🛠️ You upgraded your tools.");
  return state;
}

function applyFulfill(state: GameState): GameState {
  state.player.alerts?.push("📦 You fulfilled a town request.");
  return state;
}

function applyForage(state: GameState): GameState {
  state.player.alerts?.push("🌲 You foraged in the forest.");
  return state;
}

function applyFortune(state: GameState): GameState {
  state.player.alerts?.push("🔮 You told a fortune.");
  return state;
}

function applyLady(state: GameState): GameState {
  state.player.alerts?.push("🌕 You consulted the Lady of the Moon.");
  return state;
}

export function executeActions(gameState: GameState): GameState {
  const queue = gameState.pendingActions ?? [];

  for (const action of queue) {
    switch (action) {
      case "water":
        gameState = applyWater(gameState);
        break;
      case "harvest":
        gameState = applyHarvest(gameState);
        break;
      case "brew":
        gameState = applyBrew(gameState);
        break;
      case "plant":
        gameState = applyPlant(gameState);
        break;
      case "buy":
        gameState = applyBuy(gameState);
        break;
      case "sell":
        gameState = applySell(gameState);
        break;
      case "upgrade":
        gameState = applyUpgrade(gameState);
        break;
      case "fulfill":
        gameState = applyFulfill(gameState);
        break;
      case "forage":
        gameState = applyForage(gameState);
        break;
      case "fortune":
        gameState = applyFortune(gameState);
        break;
      case "lady":
        gameState = applyLady(gameState);
        break;
    }
  }

  // Clear action queue after execution
  gameState.pendingActions = [];
  return gameState;
}