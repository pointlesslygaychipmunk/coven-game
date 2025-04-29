// backend/src/gameHandler.ts
// Manages the GameEngine instance and provides methods for the server to call

import { GameEngine } from "./gameEngine";
import { 
  GameState, MoonPhase, Season, RitualQuest,
  MarketItem, Player, JournalEntry
} from "@shared/types";

import { 
  getBlackMarketTrends, 
  purchaseFromBlackMarket 
} from "./blackMarket";

import { 
  checkQuestStepCompletion, 
  claimRitualRewards,
  addRitualQuest
} from "./questSystem";

import { 
  spreadRumor, 
  createCustomRumor,
  verifyRumor
} from "./rumorEngine";

import { 
  calculateBrewingSuccess,
  brewPotion
} from "./brewing";

// GameHandler: Connects the server's API endpoints to the game engine
export class GameHandler {
  engine: GameEngine;

  constructor() {
    this.engine = new GameEngine();
  }

  // Core methods

  // Get current game state
  getState(): GameState {
    return this.engine.getState();
  }

  // Garden actions

  // Plant a seed in a garden slot
  plantSeed(playerId: string, slotId: number, seedName: string): GameState {
    const success = this.engine.plantSeed(playerId, slotId, seedName);
    
    if (success) {
      // Check if this progresses any ritual quests
      const player = this.engine.state.players.find(p => p.id === playerId);
      if (player) {
        checkQuestStepCompletion(
          this.engine.state, 
          player, 
          'plant',
          { seedName, slotId }
        );
      }
    }
    
    return this.engine.getState();
  }

  // Water plants in garden
  waterPlants(playerId: string, success: boolean): GameState {
    this.engine.waterPlants(playerId, success);
    return this.engine.getState();
  }

  // Harvest a mature plant
  harvestPlant(playerId: string, slotId: number): GameState {
    const result = this.engine.harvestPlant(playerId, slotId);
    
    if (result) {
      // Get information about the harvested plant
      const player = this.engine.state.players.find(p => p.id === playerId);
      if (player) {
        // Find the most recently added inventory item (the harvest)
        const lastItem = player.inventory[player.inventory.length - 1];
        
        // Check for ritual progression
        checkQuestStepCompletion(
          this.engine.state,
          player,
          'harvest',
          { 
            plantName: lastItem.name,
            quality: lastItem.quality || 70,
            slotId
          }
        );
      }
    }
    
    return this.engine.getState();
  }

  // Brewing actions

  // Brew a potion from ingredients
  brewPotion(playerId: string, ingredientNames: [string, string]): GameState {
    const success = this.engine.brewPotion(playerId, ingredientNames);
    
    if (success) {
      // Check for ritual progression
      const player = this.engine.state.players.find(p => p.id === playerId);
      if (player) {
        // Find the most recently added item (the potion)
        const lastItem = player.inventory[player.inventory.length - 1];
        
        checkQuestStepCompletion(
          this.engine.state,
          player,
          'brew',
          {
            potionName: lastItem.name,
            quality: lastItem.quality || 70,
            moonPhase: this.engine.state.time.phaseName
          }
        );
      }
    }
    
    return this.engine.getState();
  }

  // Ritual quest actions

  // Progress a ritual through special actions
  progressRitual(
    playerId: string, 
    ritualId: string, 
    action: string, 
    details: any
  ): GameState {
    const player = this.engine.state.players.find(p => p.id === playerId);
    if (!player) return this.engine.getState();
    
    // Find the ritual
    const ritual = this.engine.state.rituals.find(r => r.id === ritualId);
    if (!ritual || ritual.stepsCompleted >= ritual.totalSteps) {
      return this.engine.getState();
    }
    
    // Check if the action progresses the ritual
    checkQuestStepCompletion(
      this.engine.state,
      player,
      action,
      details
    );
    
    return this.engine.getState();
  }

  // Claim rewards from a completed ritual
  claimRitualReward(playerId: string, ritualId: string): GameState {
    const player = this.engine.state.players.find(p => p.id === playerId);
    if (!player) return this.engine.getState();
    
    claimRitualRewards(this.engine.state, player, ritualId);
    
    return this.engine.getState();
  }

  // Market actions

  // Buy an item from the market
  buyItem(playerId: string, itemId: string): GameState {
    this.engine.buyItem(playerId, itemId);
    return this.engine.getState();
  }

  // Sell an item to the market
  sellItem(playerId: string, itemId: string): GameState {
    const success = this.engine.sellItem(playerId, itemId);
    
    if (success) {
      // Check if this progresses any ritual quest
      const player = this.engine.state.players.find(p => p.id === playerId);
      if (player) {
        // Find the market item to get price info
        const marketItem = this.engine.state.market.find(item => item.id === itemId);
        
        if (marketItem) {
          checkQuestStepCompletion(
            this.engine.state,
            player,
            'sell',
            {
              itemId: itemId,
              itemName: marketItem.name,
              price: marketItem.price,
              maxPrice: marketItem.basePrice * 1.5 // Estimate of max price
            }
          );
        }
      }
    }
    
    return this.engine.getState();
  }

  // Black market actions

  // Access the black market
  accessBlackMarket(playerId: string): GameState {
    this.engine.accessBlackMarket(playerId);
    return this.engine.getState();
  }

  // Buy from the black market
  buyFromBlackMarket(playerId: string, itemId: string, traderId?: string): any {
    const player = this.engine.state.players.find(p => p.id === playerId);
    if (!player) {
      return { success: false, message: "Player not found" };
    }
    
    const result = purchaseFromBlackMarket(this.engine.state, player, itemId, traderId);
    
    // If successful, check for quest progression
    if (result.success) {
      // Find the most recently added inventory item
      const lastItem = player.inventory[player.inventory.length - 1];
      
      checkQuestStepCompletion(
        this.engine.state,
        player,
        'collection',
        { itemName: lastItem.name }
      );
    }
    
    return {
      ...result,
      state: this.engine.getState()
    };
  }

  // Get black market trends
  getBlackMarketTrends(playerId: string): any {
    const player = this.engine.state.players.find(p => p.id === playerId);
    if (!player || !player.blackMarketAccess) {
      return { success: false, message: "No access to black market" };
    }
    
    const trends = getBlackMarketTrends(this.engine.state);
    
    return {
      success: true,
      trends
    };
  }

  // Town request actions

  // Fulfill a town request
  fulfillRequest(playerId: string, requestId: string): GameState {
    this.engine.fulfillRequest(playerId, requestId);
    return this.engine.getState();
  }

  // Rumor system

  // Spread a rumor to increase its effect
  spreadRumor(playerId: string, rumorId: string): GameState {
    const success = spreadRumor(this.engine.state, playerId, rumorId);
    
    // May add additional effects here (reputation changes, etc.)
    
    return this.engine.getState();
  }

  // Create a new rumor
  createRumor(
    playerId: string, 
    content: string, 
    itemName: string, 
    priceEffect: number
  ): GameState {
    const player = this.engine.state.players.find(p => p.id === playerId);
    if (!player) return this.engine.getState();
    
    // Check if player has enough reputation/skill to create rumors
    if (player.reputation < 10 || player.skills.trading < 2) {
      // Add journal entry about failure
      this.addJournalEntry(
        "Your attempt to spread a new rumor failed. You need more reputation or trading skill.",
        'market',
        2
      );
      
      return this.engine.getState();
    }
    
    // Cap the price effect
    const cappedEffect = Math.max(-0.3, Math.min(0.3, priceEffect));
    
    createCustomRumor(this.engine.state, content, itemName, cappedEffect);
    
    // Small reputation cost for starting rumors
    player.reputation = Math.max(0, player.reputation - 2);
    
    this.addJournalEntry(
      `You've started a new rumor about ${itemName} in the market.`,
      'market',
      3
    );
    
    return this.engine.getState();
  }

  // Game turn management

  // End the current player's turn
  endTurn(playerId: string): GameState {
    this.engine.endTurn(playerId);
    return this.engine.getState();
  }

  // Save/Load game
  
  // Save the current game state
  saveGame(): string {
    return this.engine.saveGame();
  }
  
  // Load a saved game state
  loadGame(saveData: string): boolean {
    return this.engine.loadGame(saveData);
  }

  // Utility methods

  // Add a journal entry
  private addJournalEntry(text: string, category: string = 'event', importance: number = 3): void {
    const entry: JournalEntry = {
      id: this.engine.state.journal.length + 1,
      turn: this.engine.state.journal.length,
      date: `${this.engine.state.time.phaseName}, ${this.engine.state.time.season} Year ${this.engine.state.time.year}`,
      text: text,
      category: category as any,
      importance: importance,
      readByPlayer: false
    };
    
    this.engine.state.journal.push(entry);
  }
  
  // Debug/Admin methods

  // Set the current moon phase (for debugging/testing)
  debugSetMoonPhase(phaseName: string): GameState {
    const validPhases = [
      "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
      "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
    ];
    
    if (validPhases.includes(phaseName)) {
      this.engine.state.time.phaseName = phaseName as MoonPhase;
      this.engine.state.time.phase = validPhases.indexOf(phaseName);
      
      this.addJournalEntry(`[DEBUG] Moon phase set to ${phaseName}`, 'event', 1);
    }
    
    return this.engine.getState();
  }

  // Set the current season (for debugging/testing)
  debugSetSeason(season: string): GameState {
    const validSeasons = ["Spring", "Summer", "Fall", "Winter"];
    
    if (validSeasons.includes(season)) {
      this.engine.state.time.season = season as Season;
      
      this.addJournalEntry(`[DEBUG] Season set to ${season}`, 'event', 1);
    }
    
    return this.engine.getState();
  }

  // Give an item to a player (for debugging/testing)
  debugGiveItem(
    playerId: string, 
    itemName: string, 
    quantity: number = 1, 
    quality: number = 70
  ): GameState {
    const player = this.engine.state.players.find(p => p.id === playerId);
    if (!player) return this.engine.getState();
    
    // Use the engine's addItemToInventory method if available
    // For this example, we'll improvise
    
    // Find an existing item to copy its properties
    const existingItem = this.engine.state.market.find(item => item.name === itemName);
    
    if (existingItem) {
      // Add to inventory
      const existing = player.inventory.find(i => i.name === itemName);
      
      if (existing) {
        existing.quantity += quantity;
      } else {
        player.inventory.push({
          id: existingItem.id,
          name: itemName,
          category: existingItem.category,
          type: existingItem.type,
          quantity: quantity,
          quality: quality
        });
      }
      
      this.addJournalEntry(
        `[DEBUG] Added ${quantity} ${itemName} (quality: ${quality}%) to inventory`,
        'event',
        1
      );
    } else {
      this.addJournalEntry(`[DEBUG] Item "${itemName}" not found in market`, 'event', 1);
    }
    
    return this.engine.getState();
  }
}