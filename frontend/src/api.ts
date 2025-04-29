// frontend/src/api.ts
// Utility functions for calling backend API endpoints

// Base API URL, configurable via environment variables
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper function for API requests
async function apiRequest(endpoint: string, method: string = 'GET', data?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

// Get current game state
export async function fetchState() {
  return apiRequest('/state');
}

// Garden actions

// Plant a seed in a garden slot
export async function plantSeed(playerId: string, slotId: number, seedName: string) {
  return apiRequest('/plant', 'POST', { playerId, slotId, seedName });
}

// Water plants (with success parameter from minigame)
export async function waterPlants(playerId: string, success: boolean) {
  return apiRequest('/water', 'POST', { playerId, success });
}

// Harvest a mature plant
export async function harvestPlant(playerId: string, slotId: number) {
  return apiRequest('/harvest', 'POST', { playerId, slotId });
}

// Brewing actions

// Brew a potion from ingredients
export async function brewPotion(playerId: string, ingredients: [string, string]) {
  return apiRequest('/brew', 'POST', { playerId, ingredients });
}

// Market actions

// Buy an item from the market
export async function buyItem(playerId: string, itemId: string) {
  return apiRequest('/market/buy', 'POST', { playerId, itemId });
}

// Sell an item to the market
export async function sellItem(playerId: string, itemId: string) {
  return apiRequest('/market/sell', 'POST', { playerId, itemId });
}

// Black market actions

// Access the black market
export async function accessBlackMarket(playerId: string) {
  return apiRequest('/blackmarket/access', 'POST', { playerId });
}

// Buy from the black market (optional trader for discounts)
export async function buyFromBlackMarket(playerId: string, itemId: string, traderId?: string) {
  return apiRequest('/blackmarket/buy', 'POST', { playerId, itemId, traderId });
}

// Get black market trends
export async function getBlackMarketTrends(playerId: string) {
  return apiRequest(`/blackmarket/trends?playerId=${playerId}`);
}

// Town request actions

// Fulfill a town request
export async function fulfillRequest(playerId: string, requestId: string) {
  return apiRequest('/fulfill', 'POST', { playerId, requestId });
}

// Ritual actions

// Progress a ritual quest
export async function progressRitual(
  playerId: string, 
  ritualId: string, 
  action: string,
  details: any
) {
  return apiRequest('/ritual/progress', 'POST', { playerId, ritualId, action, details });
}

// Claim rewards from a completed ritual
export async function claimRitualReward(playerId: string, ritualId: string) {
  return apiRequest('/ritual/claim', 'POST', { playerId, ritualId });
}

// Rumor actions

// Spread a rumor to increase its effect
export async function spreadRumor(playerId: string, rumorId: string) {
  return apiRequest('/rumor/spread', 'POST', { playerId, rumorId });
}

// Create a new rumor
export async function createRumor(
  playerId: string, 
  content: string, 
  itemName: string, 
  priceEffect: number
) {
  return apiRequest('/rumor/create', 'POST', { playerId, content, itemName, priceEffect });
}

// Game turn management

// End the current player's turn
export async function endTurn(playerId: string) {
  return apiRequest('/end-turn', 'POST', { playerId });
}

// Save/Load game

// Save the current game state
export async function saveGame() {
  return apiRequest('/save', 'POST');
}

// Load a saved game state
export async function loadGame(saveData: string) {
  return apiRequest('/load', 'POST', { saveData });
}

// Debug/Admin methods (would be restricted in production)

// Set the current moon phase
export async function debugSetMoonPhase(phaseName: string) {
  return apiRequest('/debug/set-phase', 'POST', { phaseName });
}

// Set the current season
export async function debugSetSeason(season: string) {
  return apiRequest('/debug/set-season', 'POST', { season });
}

// Give an item to a player
export async function debugGiveItem(
  playerId: string, 
  itemName: string, 
  quantity: number = 1, 
  quality: number = 70
) {
  return apiRequest('/debug/give-item', 'POST', { playerId, itemName, quantity, quality });
}