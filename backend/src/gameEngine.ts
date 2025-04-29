// backend/src/gameEngine.ts
// The central game engine managing game state and player actions

import { 
  GameState, Player, GardenSlot, InventoryItem, Plant, MarketItem,
  WeatherFate, MoonPhase, Season, TownRequest, ItemType, ItemCategory,
  RitualQuest, Rumor, JournalEntry, GameTime, ActionLog
} from "@shared/types";

import { ITEMS, getInitialMarket } from "./items";
import { processTurn } from "./turnEngine";
import { generateTownRequests } from "./townRequests";
import { applyMarketEvents } from "./marketEvents";
import { generateRumors, processRumorEffects } from "./rumorEngine";
import { progressRituals, checkRitualCompletion } from "./questSystem";
import { getSpecializationBonus } from "./atelier";
import { processBlackMarket } from "./blackMarket";
import { RECIPES } from "./brewing";
import { INGREDIENTS, getIngredientData } from "./ingredients";

// Utility function: Find an item in a player's inventory by item name
function findInventoryItem(player: Player, itemName: string): InventoryItem | undefined {
  return player.inventory.find(inv => inv.name === itemName);
}

// Utility function: Find an item by name in the master item list
function findItemData(itemName: string): any {
  return ITEMS.find(item => item.name === itemName);
}

// Calculate inventory value
function calculateInventoryValue(player: Player, market: MarketItem[]): number {
  return player.inventory.reduce((total, item) => {
    const marketItem = market.find(mi => mi.name === item.name);
    if (!marketItem) return total;
    return total + (marketItem.price * item.quantity);
  }, 0);
}

// Add an item to player's inventory with proper quality tracking
function addItemToInventory(
  player: Player, 
  itemName: string, 
  quantity: number, 
  quality = 100, 
  currentPhase?: MoonPhase, 
  currentSeason?: Season
): boolean {
  const itemData = findItemData(itemName);
  if (!itemData) return false;

  const existing = findInventoryItem(player, itemName);
  
  // Item to add with quality and time tracking
  const newItem: Partial<InventoryItem> = {
    id: itemData.id,
    name: itemData.name,
    category: itemData.category || 'herb', // Default
    type: itemData.type,
    quantity: quantity,
    quality: quality
  };
  
  // Track when harvested for potency calculation
  if (currentPhase) {
    newItem.harvestedDuring = currentPhase;
  }
  
  if (currentSeason) {
    newItem.harvestedSeason = currentSeason;
  }

  if (existing) {
    // Merge with existing stack, averaging quality
    const totalQuantity = existing.quantity + quantity;
    const avgQuality = Math.round(
      (existing.quality || 100) * existing.quantity + (quality * quantity)
    ) / totalQuantity;
    
    existing.quantity = totalQuantity;
    existing.quality = avgQuality;
  } else {
    // Add as new item
    player.inventory.push(newItem as InventoryItem);
  }
  
  return true;
}

// Remove item(s) from inventory
function removeItemFromInventory(player: Player, itemName: string, quantity: number): boolean {
  const invItem = findInventoryItem(player, itemName);
  if (!invItem || invItem.quantity < quantity) {
    return false; // not enough items to remove
  }
  
  invItem.quantity -= quantity;
  if (invItem.quantity <= 0) {
    // Remove item from inventory if quantity is zero
    player.inventory = player.inventory.filter(inv => inv.name !== itemName);
  }
  
  return true;
}

// Main Game Engine class
export class GameEngine {
  state: GameState;
  actionLog: ActionLog[] = [];

  constructor() {
    // Initialize game state with one player and default values
    const initialPlayer: Player = this.createNewPlayer("player1", "Player One", "Essence");
    
    // Assemble initial game state with all required components
    this.state = {
      players: [initialPlayer],
      market: getInitialMarket(),
      marketData: {
        inflation: 1.0,
        demand: {},
        supply: {},
        volatility: 0.1,
        blackMarketAccessCost: 50,
        blackMarketUnlocked: false,
        tradingVolume: 0
      },
      townRequests: [],
      rituals: [{
        id: "ritual1",
        name: "Essence Mastery Ritual",
        description: "Master the art of essence extraction through a multi-step ritual.",
        stepsCompleted: 0,
        totalSteps: 3,
        steps: [
          { description: "Brew a Moon Glow Serum during the Full Moon", completed: false },
          { description: "Harvest 3 Moonbuds in a single moon phase", completed: false },
          { description: "Create a Radiant Moon Mask with ingredients of 90+ quality", completed: false }
        ],
        rewards: [
          { type: 'skill', value: 'essence' },
          { type: 'item', value: 'Lunaria Essence Stone' }
        ],
        requiredMoonPhase: undefined,
        requiredSeason: undefined,
        deadline: undefined,
        unlocked: true
      }],
      rumors: [],
      journal: [],
      events: [],
      currentPlayerIndex: 0,
      time: {
        year: 1,
        season: "Spring",
        phase: 0,
        phaseName: "New Moon",
        weatherFate: "normal",
        previousWeatherFate: undefined,
        dayCount: 1
      },
      version: "1.0.0"
    };
    
    // Generate initial town requests and initial journal entry
    this.state.townRequests = generateTownRequests(this.state.time.season);
    this.addJournal(`Game start: ${this.state.time.season} Y${this.state.time.year}, ${this.state.time.phaseName}.`, 'event', 5);
    this.addJournal(`Weather is ${this.state.time.weatherFate}.`, 'event', 3);
    
    // Initialize market data with starting values
    this.initializeMarketData();
  }
  
  // Create a new player with starter items based on specialization
  createNewPlayer(id: string, name: string, specialization: string): Player {
    const newPlayer: Player = {
      id: id,
      name: name,
      gold: 50,
      mana: 0,
      reputation: 0,
      atelierSpecialization: specialization as any,
      atelierLevel: 1,
      skills: {
        gardening: 1,
        brewing: 1,
        trading: 1,
        crafting: 1,
        herbalism: 1,
        astrology: 1
      },
      inventory: [],
      garden: [],
      knownRecipes: ["Radiant Moon Mask", "Moon Glow Serum", "Ginseng Infusion"],
      completedRituals: [],
      journalEntries: [],
      questsCompleted: 0,
      daysSurvived: 0,
      blackMarketAccess: false,
      lastActive: 0
    };
    
    // Create garden slots (3x3 garden grid)
    const numSlots = 9;
    newPlayer.garden = Array.from({ length: numSlots }, (_, idx) => ({
      id: idx,
      plant: null,
      fertility: 80,
      sunlight: 70, 
      moisture: 50
    }));
    
    // Give specialization-specific starter items
    this.giveStarterItems(newPlayer, specialization);
    
    return newPlayer;
  }
  
  // Give player starter items based on their specialization
  giveStarterItems(player: Player, specialization: string): void {
    // Common starter items for all specializations
    addItemToInventory(player, "Moonbud Seed", 2);
    addItemToInventory(player, "Glimmerroot Seed", 2);
    
    // Specialization-specific bonuses
    switch(specialization) {
      case "Essence":
        addItemToInventory(player, "Ancient Ginseng", 2);
        addItemToInventory(player, "Sacred Lotus", 1);
        break;
      case "Fermentation":
        addItemToInventory(player, "Silverleaf Seed", 3);
        addItemToInventory(player, "Clay Jar", 1);
        break;
      case "Distillation":
        addItemToInventory(player, "Emberberry Seed", 2);
        addItemToInventory(player, "Glass Vial", 2);
        break;
      case "Infusion":
        addItemToInventory(player, "Sweetshade Seed", 2);
        addItemToInventory(player, "Calming Tea Base", 1);
        break;
      default:
        // Default fallback
        addItemToInventory(player, "Ancient Ginseng", 1);
        addItemToInventory(player, "Sacred Lotus", 1);
    }
  }
  
  // Initialize market data
  initializeMarketData(): void {
    // Set initial demand and supply values for all market items
    this.state.market.forEach(item => {
      this.state.marketData.demand[item.name] = 50 + Math.floor(Math.random() * 20) - 10; // Base 50±10
      this.state.marketData.supply[item.name] = 50 + Math.floor(Math.random() * 20) - 10; // Base 50±10
    });
  }

  // Add a comprehensive journal entry
  addJournal(text: string, category: string = 'event', importance: number = 3): void {
    const entry: JournalEntry = {
      id: this.state.journal.length + 1,
      turn: this.state.journal.length,
      date: `${this.state.time.phaseName}, ${this.state.time.season} Year ${this.state.time.year}`,
      text: text,
      category: category as any,
      importance: importance,
      readByPlayer: false
    };
    
    this.state.journal.push(entry);
  }

  // Log a player action for debugging and analytics
  logAction(playerId: string, action: string, parameters: any, result: boolean): void {
    this.actionLog.push({
      playerId,
      action: action as any,
      timestamp: Date.now(),
      parameters,
      result
    });
    
    // Keep action log from growing too large
    if (this.actionLog.length > 1000) {
      this.actionLog = this.actionLog.slice(-500);
    }
  }

  // Player action: plant a seed in a specific garden slot
  plantSeed(playerId: string, slotId: number, seedName: string): boolean {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return false;
    
    const slot = player.garden.find(s => s.id === slotId);
    if (!slot) return false;
    
    // Ensure slot is empty and player has the seed
    if (slot.plant !== null) {
      console.warn("Slot not empty");
      return false;
    }
    
    const seedItem = findInventoryItem(player, seedName);
    if (!seedItem || seedItem.quantity < 1) {
      console.warn("Seed not available in inventory");
      return false;
    }
    
    // Determine the plant name from the seed name (remove "Seed" and trim)
    let plantName = seedName;
    if (plantName.endsWith(" Seed")) {
      plantName = plantName.replace(" Seed", "");
    }
    
    // Get plant data from ingredients list
    const ingredientData = getIngredientData(plantName);
    const maxGrowth = ingredientData ? ingredientData.growthTime : 3;
    
    // Seed quality affects initial plant health
    const seedQuality = seedItem.quality || 100;
    const initialHealth = Math.max(50, seedQuality);
    
    // Moon phase can affect planting (special moonblessed property)
    const moonBlessed = this.state.time.phaseName === "Full Moon";
    
    // Create comprehensive Plant object
    const newPlant: Plant = {
      name: plantName,
      category: ingredientData?.category as ItemCategory || 'herb',
      growth: 0,
      maxGrowth: maxGrowth,
      watered: false,
      health: initialHealth,
      age: 0,
      mature: false,
      moonBlessed: moonBlessed,
      seasonalModifier: this.calculateSeasonalModifier(plantName, this.state.time.season),
      deathChance: 0
    };
    
    // Place the plant in the garden slot and remove one seed from inventory
    slot.plant = newPlant;
    removeItemFromInventory(player, seedName, 1);
    
    // Adjust moisture based on current weather
    if (this.state.time.weatherFate === 'rainy') {
      slot.moisture = Math.min(100, slot.moisture + 30);
    } else if (this.state.time.weatherFate === 'dry') {
      slot.moisture = Math.max(10, slot.moisture - 10);
    }
    
    // XP for gardening skill
    player.skills.gardening += 0.2;
    
    // Add journal entry with details
    let journalText = `Planted a ${plantName} in garden slot ${slotId}.`;
    if (moonBlessed) {
      journalText += " The Full Moon has blessed this plant with special properties!";
    }
    this.addJournal(journalText);
    
    // Log the action
    this.logAction(playerId, 'plant', { slotId, seedName }, true);
    
    return true;
  }

  // Calculate how well a plant grows in a given season (0.5 to 1.5 multiplier)
  calculateSeasonalModifier(plantName: string, season: Season): number {
    // Different plants thrive in different seasons
    const seasonalAffinities: Record<string, Season> = {
      'Moonbud': 'Winter',
      'Glimmerroot': 'Spring',
      'Silverleaf': 'Fall',
      'Sunpetal': 'Summer',
      'Nightcap': 'Fall',
      'Everdew': 'Summer',
      'Sweetshade': 'Spring',
      'Emberberry': 'Summer'
    };
    
    const bestSeason = seasonalAffinities[plantName] || 'Spring';
    
    if (season === bestSeason) {
      return 1.5; // Optimal season
    } else {
      // Opposite seasons have lowest modifier
      const seasonOrder = ['Spring', 'Summer', 'Fall', 'Winter'];
      const currentIdx = seasonOrder.indexOf(season);
      const bestIdx = seasonOrder.indexOf(bestSeason);
      
      // Calculate distance between seasons (0-2)
      const distance = Math.min(
        Math.abs(currentIdx - bestIdx),
        seasonOrder.length - Math.abs(currentIdx - bestIdx)
      );
      
      // Convert to modifier (1.5 -> 1.0 -> 0.5)
      return 1.5 - (distance * 0.5);
    }
  }

  // Player action: water all plants
  waterPlants(playerId: string, success: boolean): boolean {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return false;
    
    // Apply player's skill level to watering effectiveness
    const wateringSkill = Math.min(2, player.skills.gardening / 10); // 0-2 bonus based on skill
    
    // Mark all plants in player's garden as watered if success
    player.garden.forEach(slot => {
      if (!slot.plant) return;
      
      if (success) {
        slot.plant.watered = true;
        
        // Increase moisture level based on skill
        slot.moisture = Math.min(100, slot.moisture + 30 + (wateringSkill * 10));
        
        // Improve health if plant was dehydrated
        if (slot.moisture < 30 && slot.plant.health < 90) {
          slot.plant.health += 5;
        }
      } else {
        // Failed watering - only partial moisture added
        slot.moisture = Math.min(100, slot.moisture + 10);
      }
    });
    
    // Experience for gardening skill
    if (success) {
      player.skills.gardening += 0.3;
    } else {
      player.skills.gardening += 0.1; // Even failed attempts teach a little
    }
    
    if (success) {
      this.addJournal(`Watered all plants successfully.`);
    } else {
      this.addJournal(`Failed to water the plants properly.`);
    }
    
    // Log the action
    this.logAction(playerId, 'water', { success }, success);
    
    return success;
  }

  // Player action: harvest a mature plant from the garden
  harvestPlant(playerId: string, slotId: number): boolean {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return false;
    
    const slot = player.garden.find(s => s.id === slotId);
    if (!slot || !slot.plant) return false;
    
    const plant = slot.plant;
    
    // Only allow harvest if plant is mature
    if (plant.growth < plant.maxGrowth) {
      console.warn("Plant not yet mature");
      return false;
    }
    
    // Calculate harvest quality based on plant health and care
    let harvestQuality = plant.health;
    
    // Moon phase bonus
    if (this.state.time.phaseName === "Full Moon") {
      harvestQuality = Math.min(100, harvestQuality + 15);
    } else if (this.state.time.phaseName === "New Moon") {
      harvestQuality = Math.max(1, harvestQuality - 5);
    }
    
    // Seasonal bonus
    if (plant.seasonalModifier && plant.seasonalModifier > 1.2) {
      harvestQuality = Math.min(100, harvestQuality + 10);
    }
    
    // Moonblessed plants have higher quality
    if (plant.moonBlessed) {
      harvestQuality = Math.min(100, harvestQuality + 20);
    }
    
    // Gardening skill affects quality
    harvestQuality = Math.min(100, harvestQuality + (player.skills.gardening / 2));
    
    // Determine yield (the plant's name corresponds to the ingredient yielded)
    const yieldName = plant.name;
    
    // Add to inventory with the calculated quality
    addItemToInventory(
      player, 
      yieldName, 
      1, 
      harvestQuality, 
      this.state.time.phaseName, 
      this.state.time.season
    );
    
    // Small chance for extra yield based on quality and luck
    if (harvestQuality > 80 && Math.random() < 0.25) {
      addItemToInventory(
        player, 
        yieldName, 
        1, 
        harvestQuality - 10, 
        this.state.time.phaseName, 
        this.state.time.season
      );
      this.addJournal(`Extra yield from high-quality harvest of ${yieldName}!`);
    }
    
    // Remove the plant from the garden (clear the slot)
    slot.plant = null;
    
    // Reduce fertility slightly after harvest
    slot.fertility = Math.max(50, slot.fertility - 5);
    
    // XP for gardening skill
    player.skills.gardening += 0.5;
    
    // Journal entry about quality
    let qualityText = "average";
    if (harvestQuality >= 90) qualityText = "exceptional";
    else if (harvestQuality >= 70) qualityText = "good";
    else if (harvestQuality <= 30) qualityText = "poor";
    
    this.addJournal(`Harvested ${yieldName} of ${qualityText} quality (${harvestQuality}%) from slot ${slotId}.`);
    
    // Log the action
    this.logAction(playerId, 'harvest', { slotId, plantName: yieldName, quality: harvestQuality }, true);
    
    return true;
  }

  // Player action: brew a potion from ingredients
  brewPotion(playerId: string, ingredientNames: [string, string]): boolean {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return false;
    
    const [ing1, ing2] = ingredientNames;
    
    // Check if player has the ingredients
    const ingItem1 = findInventoryItem(player, ing1);
    const ingItem2 = findInventoryItem(player, ing2);
    
    if (!ingItem1 || !ingItem2 || ingItem1.quantity < 1 || ingItem2.quantity < 1) {
      console.warn("Missing ingredients for brewing");
      return false;
    }
    
    // Find a matching recipe (order-independent)
    const recipe = RECIPES.find(rec => {
      const recipeIngs = [rec.ingredients[0].itemName, rec.ingredients[1].itemName];
      return recipeIngs.includes(ing1) && recipeIngs.includes(ing2);
    });
    
    if (!recipe) {
      // Combination not valid
      this.addJournal(`Brew attempt failed: mixing ${ing1} and ${ing2} produced no useful result.`);
      
      // Consume half the ingredients on failure (they're wasted)
      removeItemFromInventory(player, ing1, 1);
      removeItemFromInventory(player, ing2, 1);
      
      // Log the failed action
      this.logAction(playerId, 'brew', { ingredients: [ing1, ing2] }, false);
      
      return false;
    }
    
    // Calculate brewing success chance and quality
    let brewQuality = 0;
    let successChance = 0.7; // Base 70% success
    
    // Ingredient quality affects outcome
    const ing1Quality = ingItem1.quality || 50;
    const ing2Quality = ingItem2.quality || 50;
    const avgQuality = Math.floor((ing1Quality + ing2Quality) / 2);
    
    // Brewing skill improves success chance
    successChance += player.skills.brewing * 0.05; // Each level adds 5%
    
    // Atelier specialization bonus
    if (player.atelierSpecialization === "Fermentation" || player.atelierSpecialization === "Distillation") {
      successChance += 0.1; // +10% for relevant specializations
    }
    
    // Moon phase brewing bonus
    if (this.state.time.phaseName === "Full Moon") {
      successChance += 0.15; // +15% on full moon
      brewQuality = avgQuality + 15;
    } else if (this.state.time.phaseName === "New Moon") {
      successChance -= 0.05; // -5% on new moon
      brewQuality = avgQuality - 5;
    } else {
      brewQuality = avgQuality;
    }
    
    // Cap success chance and quality
    successChance = Math.min(0.95, Math.max(0.3, successChance));
    brewQuality = Math.min(100, Math.max(10, brewQuality));
    
    // Determine if brewing succeeds
    const brewSuccess = Math.random() < successChance;
    
    // Consume ingredients regardless of outcome
    removeItemFromInventory(player, ing1, 1);
    removeItemFromInventory(player, ing2, 1);
    
    if (!brewSuccess) {
      this.addJournal(`Brewing attempt failed! The mixture of ${ing1} and ${ing2} bubbled and fizzled, but produced nothing useful.`);
      
      // Small XP even for failure
      player.skills.brewing += 0.1;
      
      // Log the action
      this.logAction(playerId, 'brew', { ingredients: [ing1, ing2], success: false }, false);
      
      return false;
    }
    
    // If brewing succeeds, add the resulting potion to inventory
    const potionName = recipe.result;
    addItemToInventory(player, potionName, 1, brewQuality);
    
    // XP for brewing skill on success
    player.skills.brewing += 0.5;
    
    // Check if this brewing fulfills any ritual step
    let ritualProgress = false;
    this.state.rituals.forEach(ritual => {
      if (ritual.stepsCompleted >= ritual.totalSteps) return; // Already completed
      
      const currentStep = ritual.steps[ritual.stepsCompleted];
      if (currentStep && !currentStep.completed) {
        // Check for brewing-related step (simplified example)
        if (currentStep.description.includes(potionName) && 
            currentStep.description.includes(this.state.time.phaseName)) {
          currentStep.completed = true;
          ritual.stepsCompleted++;
          ritualProgress = true;
          
          this.addJournal(`Ritual progress: ${currentStep.description} - completed!`, 'ritual', 5);
        }
      }
    });
    
    // Add journal entry with quality information
    let qualityText = "average";
    if (brewQuality >= 90) qualityText = "exceptional";
    else if (brewQuality >= 70) qualityText = "good";
    else if (brewQuality <= 30) qualityText = "poor";
    
    this.addJournal(`Brewed a ${qualityText} ${potionName} (${brewQuality}%) using ${ing1} and ${ing2}.`);
    
    if (ritualProgress) {
      this.addJournal(`This brewing has advanced one of your ritual quests!`, 'ritual', 4);
    }
    
    // Log the action
    this.logAction(playerId, 'brew', { 
      ingredients: [ing1, ing2], 
      result: potionName, 
      quality: brewQuality 
    }, true);
    
    return true;
  }

  // Player action: fulfill a town request by delivering requested items
  fulfillRequest(playerId: string, requestId: string): boolean {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return false;
    
    const reqIndex = this.state.townRequests.findIndex(req => req.id === requestId);
    if (reqIndex === -1) return false;
    
    const request = this.state.townRequests[reqIndex];
    
    // Check if player has required item in required quantity
    const invItem = findInventoryItem(player, request.item);
    if (!invItem || invItem.quantity < request.quantity) {
      console.warn("Not enough items to fulfill request");
      return false;
    }
    
    // Remove the items
    if (!removeItemFromInventory(player, request.item, request.quantity)) {
      return false;
    }
    
    // Grant rewards
    player.gold += request.rewardGold;
    player.reputation += request.rewardInfluence;
    
    // Adjust market data for the item
    if (this.state.marketData.demand[request.item]) {
      // Demand decreases after fulfilling (market is now more saturated)
      this.state.marketData.demand[request.item] = Math.max(
        10, this.state.marketData.demand[request.item] - 15
      );
    }
    
    // Remove the fulfilled request 
    this.state.townRequests.splice(reqIndex, 1);
    
    // Grant trading XP
    player.skills.trading += 0.4;
    
    // Update quest count
    player.questsCompleted++;
    
    // Journal entry
    this.addJournal(`Fulfilled town request: delivered ${request.quantity} ${request.item}(s) to ${request.requester}.`);
    this.addJournal(`Received ${request.rewardGold} gold and ${request.rewardInfluence} reputation.`);
    
    // Log the action
    this.logAction(playerId, 'fulfill', { requestId, item: request.item, quantity: request.quantity }, true);
    
    return true;
  }

  // Player action: buy an item from the market
  buyItem(playerId: string, itemId: string): boolean {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return false;
    
    const marketItem = this.state.market.find(item => item.id === itemId);
    if (!marketItem) return false;
    
    const price = marketItem.price;
    if (player.gold < price) {
      console.warn("Not enough gold to buy item");
      return false;
    }
    
    // Deduct gold and add item to inventory (with standard quality)
    player.gold -= price;
    addItemToInventory(player, marketItem.name, 1, 70); // Market items are average quality
    
    // Small trading XP
    player.skills.trading += 0.2;
    
    this.addJournal(`Purchased 1 ${marketItem.name} for ${price} gold.`);
    
    // Influence market: increase demand, decrease supply
    if (this.state.marketData.demand[marketItem.name]) {
      this.state.marketData.demand[marketItem.name] = Math.min(
        100, this.state.marketData.demand[marketItem.name] + 5
      );
    }
    
    if (this.state.marketData.supply[marketItem.name]) {
      this.state.marketData.supply[marketItem.name] = Math.max(
        0, this.state.marketData.supply[marketItem.name] - 8
      );
    }
    
    // Increased demand affects price (immediate feedback)
    marketItem.price = Math.round(marketItem.price * 1.05); // 5% price increase
    
    // Trading volume increases
    this.state.marketData.tradingVolume += price;
    
    // Log the action
    this.logAction(playerId, 'buy', { itemId, name: marketItem.name, price }, true);
    
    return true;
  }

  // Player action: sell an item from inventory to the market
  sellItem(playerId: string, itemId: string): boolean {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return false;
    
    // Find item in inventory by id
    const invItem = player.inventory.find(inv => inv.id === itemId);
    if (!invItem || invItem.quantity < 1) {
      console.warn("Item not available to sell");
      return false;
    }
    
    // Find market entry for this item
    const marketItem = this.state.market.find(item => item.id === itemId);
    if (!marketItem) {
      console.warn("No market entry for item being sold");
      return false;
    }
    
    // Quality affects sell price (high quality = better price)
    const qualityMultiplier = ((invItem.quality || 70) / 100) * 0.5 + 0.75; // 0.75-1.25x based on quality
    const sellPrice = Math.round(marketItem.price * qualityMultiplier);
    
    // Remove item from inventory and add gold
    removeItemFromInventory(player, invItem.name, 1);
    player.gold += sellPrice;
    
    // Trading skill XP
    player.skills.trading += 0.3;
    
    this.addJournal(`Sold 1 ${invItem.name} for ${sellPrice} gold (quality: ${invItem.quality || 70}%).`);
    
    // Influence market: increase supply, reduce demand
    if (this.state.marketData.supply[marketItem.name]) {
      this.state.marketData.supply[marketItem.name] = Math.min(
        100, this.state.marketData.supply[marketItem.name] + 10
      );
    }
    
    if (this.state.marketData.demand[marketItem.name]) {
      this.state.marketData.demand[marketItem.name] = Math.max(
        0, this.state.marketData.demand[marketItem.name] - 5
      );
    }
    
    // Increased supply affects price (immediate feedback)
    marketItem.price = Math.max(1, Math.round(marketItem.price * 0.95)); // 5% price decrease
    
    // Trading volume increases
    this.state.marketData.tradingVolume += sellPrice;
    
    // Log the action
    this.logAction(playerId, 'sell', { 
      itemId, 
      name: invItem.name, 
      price: sellPrice, 
      quality: invItem.quality 
    }, true);
    
    return true;
  }

  // Access the black market (costs reputation or gold)
  accessBlackMarket(playerId: string): boolean {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return false;
    
    // Check if player already has access
    if (player.blackMarketAccess) return true;
    
    const accessCost = this.state.marketData.blackMarketAccessCost;
    
    // Player must have either enough gold or reputation
    if (player.gold < accessCost && player.reputation < 10) {
      this.addJournal(`Access to the black market denied. You need either ${accessCost} gold or 10 reputation.`);
      return false;
    }
    
    // Charge gold or reputation (player's choice, prioritize gold)
    if (player.gold >= accessCost) {
      player.gold -= accessCost;
      this.addJournal(`Paid ${accessCost} gold for black market access.`);
    } else {
      player.reputation -= 10;
      this.addJournal(`Used 10 reputation to gain black market access.`);
    }
    
    // Grant access
    player.blackMarketAccess = true;
    this.state.marketData.blackMarketUnlocked = true;
    
    // Special journal entry
    this.addJournal(`You have gained access to the black market! Special rare items will now be available.`, 'market', 5);
    
    // Log the action
    this.logAction(playerId, 'accessBlackMarket', { cost: accessCost }, true);
    
    // Trigger black market initialization
    processBlackMarket(this.state);
    
    return true;
  }

  // End the current player's turn and potentially advance the game world
  endTurn(playerId: string): void {
    // Only allow if it's actually this player's turn (in a multiplayer scenario)
    const currentPlayer = this.state.players[this.state.currentPlayerIndex];
    if (currentPlayer.id !== playerId) {
      console.warn("Not this player's turn");
      return;
    }
    
    // Update player's lastActive timestamp
    currentPlayer.daysSurvived += 1;
    currentPlayer.lastActive = this.state.time.dayCount;
    
    const lastIndex = this.state.players.length - 1;
    if (this.state.currentPlayerIndex >= lastIndex) {
      // If current player is the last in turn order, advance the world one phase
      this.advancePhase(); // advance moon phase, season, weather, etc.
      this.state.currentPlayerIndex = 0; // back to first player
    } else {
      // Otherwise, move to next player's turn (without advancing phase yet)
      this.state.currentPlayerIndex += 1;
    }
    
    this.addJournal(`End of ${currentPlayer.name}'s turn.`);
    
    // Log the action
    this.logAction(playerId, 'endTurn', {}, true);
  }

  // Advance the game world by one moon phase (after all players have taken their turns)
  private advancePhase(): void {
    // Store previous state for comparison and event triggering
    const prevPhaseName = this.state.time.phaseName;
    const prevSeason = this.state.time.season;
    const prevWeatherFate = this.state.time.weatherFate;
    
    // Process turn - update state for new phase/season/weather, grow plants, etc.
    this.state = processTurn(this.state);
    
    // Increment total day count
    this.state.time.dayCount += 1;
    
    // Log the phase/season advancement
    this.addJournal(`The moon has advanced to ${this.state.time.phaseName} (${this.state.time.season} Y${this.state.time.year}).`, 'moon', 4);
    this.addJournal(`Weather this phase: ${this.state.time.weatherFate}.`, 'event', 3);
    
    // Check for season change
    if (prevSeason !== this.state.time.season) {
      this.addJournal(`The season has changed from ${prevSeason} to ${this.state.time.season}!`, 'season', 5);
      
      // Seasonal events and bonuses
      this.triggerSeasonalEvents(prevSeason, this.state.time.season);
    }
    
    // After advancing phase, generate new world events:
    
    // 1. Town Requests
    const newRequests = generateTownRequests(this.state.time.season);
    if (newRequests.length > 0) {
      this.state.townRequests.push(...newRequests);
      this.addJournal(`New town requests have arrived for the ${this.state.time.season}.`);
    }
    
    // 2. Rumors
    const newRumors = generateRumors(this.state);
    if (newRumors.length > 0) {
      this.state.rumors.push(...newRumors);
      this.addJournal(`New rumors are circulating: ${newRumors[0].content}`, 'market', 3);
    }
    
    // 3. Market Events - prices adjust based on rumors, season, etc.
    applyMarketEvents(this.state);
    
    // 4. Apply Active Rumor Effects
    processRumorEffects(this.state);
    
    // 5. Ritual Quests - progress any that have conditions met
    progressRituals(this.state);
    
    // 6. Black Market updates (if unlocked)
    if (this.state.marketData.blackMarketUnlocked) {
      processBlackMarket(this.state);
    }
    
    // Check for any completed rituals after processing
    this.state.rituals.forEach(ritual => {
      if (ritual.stepsCompleted >= ritual.totalSteps && !ritual.steps.some(step => !step.completed)) {
        // Complete ritual if all steps done
        const player = this.state.players[this.state.currentPlayerIndex]; // Simplifying to current player
        
        if (!player.completedRituals.includes(ritual.id)) {
          player.completedRituals.push(ritual.id);
          
          // Grant rewards
          ritual.rewards.forEach(reward => {
            if (reward.type === 'gold') {
              player.gold += Number(reward.value);
              this.addJournal(`Received ${reward.value} gold from completing "${ritual.name}".`);
            } else if (reward.type === 'item') {
              const itemName = String(reward.value);
              addItemToInventory(player, itemName, 1, 100); // Reward items are high quality
              this.addJournal(`Received ${itemName} from completing "${ritual.name}".`);
            } else if (reward.type === 'skill') {
              const skillName = String(reward.value);
              if (player.skills[skillName as keyof typeof player.skills]) {
                player.skills[skillName as keyof typeof player.skills] += 1;
                this.addJournal(`${player.name}'s ${skillName} skill increased from completing "${ritual.name}".`);
              }
            }
          });
          
          this.addJournal(`Completed the ritual: "${ritual.name}"!`, 'ritual', 5);
        }
      }
    });
  }
  
  // Handle season change events and bonuses
  private triggerSeasonalEvents(oldSeason: Season, newSeason: Season): void {
    // Reset seasonal herb availability
    this.resetSeasonalHerbs(newSeason);
    
    // Adjust garden fertility based on season
    this.state.players.forEach(player => {
      player.garden.forEach(slot => {
        // Spring increases fertility, Winter decreases it
        if (newSeason === 'Spring') {
          slot.fertility = Math.min(100, slot.fertility + 10);
        } else if (newSeason === 'Winter') {
          slot.fertility = Math.max(30, slot.fertility - 5);
        }
      });
    });
    
    // Seasonal market adjustments
    this.state.market.forEach(item => {
      // Some items are more valuable in certain seasons
      const seasonalItems: Record<Season, string[]> = {
        'Spring': ['Glimmerroot', 'Sweetshade', 'Moon Glow Serum'],
        'Summer': ['Sunpetal', 'Everdew', 'Cooling Tonic'],
        'Fall': ['Ancient Ginseng', 'Silverleaf', 'Ginseng Infusion'],
        'Winter': ['Moonbud', 'Nightcap', 'Radiant Moon Mask']
      };
      
      if (seasonalItems[newSeason].includes(item.name)) {
        // Items in season get price boost
        item.price = Math.round(item.price * 1.2);
        this.addJournal(`${item.name} is more valuable during ${newSeason}.`, 'market', 2);
      }
    });
  }
  
  // Reset seasonal herb availability 
  private resetSeasonalHerbs(season: Season): void {
    // Each season has special herbs that become available
    const seasonalItems: Record<Season, string[]> = {
      'Spring': ['Dewblossom', 'Spring Root', 'Maiden Lily'],
      'Summer': ['Sunthorn', 'Dragon Petal', 'Amber Stem'],
      'Fall': ['Autumnleaf', 'Mushroom Cap', 'Twilight Berry'],
      'Winter': ['Frostherb', 'Snow Lotus', 'Winter Mint']
    };
    
    // Add seasonal herbs to market
    seasonalItems[season].forEach(herbName => {
      // Check if already in market
      if (!this.state.market.some(item => item.name === herbName)) {
        // Add new seasonal herb
        const newItem: MarketItem = {
          id: `seasonal_${herbName}`,
          name: herbName,
          type: 'ingredient',
          category: 'herb',
          description: `A seasonal herb that only grows in ${season}.`,
          rarity: 'rare',
          basePrice: 25 + Math.floor(Math.random() * 15),
          price: 25 + Math.floor(Math.random() * 15),
          seasonalBonus: season
        };
        
        this.state.market.push(newItem);
        this.addJournal(`${herbName} has appeared in the market for ${season}.`, 'market', 3);
      }
    });
    
    // Remove out-of-season herbs
    const currentSeasonalHerbs = seasonalItems[season];
    const allSeasonalHerbs = [
      ...seasonalItems.Spring,
      ...seasonalItems.Summer,
      ...seasonalItems.Fall,
      ...seasonalItems.Winter
    ];
    
    // Remove herbs from other seasons
    this.state.market = this.state.market.filter(item => {
      const isOutOfSeasonHerb = !currentSeasonalHerbs.includes(item.name) && 
                               allSeasonalHerbs.includes(item.name);
      
      return !isOutOfSeasonHerb;
    });
  }
  
  // Get the full current game state (for sending to client)
  getState(): GameState {
    return this.state;
  }
  
  // Save the game state (basic implementation)
  saveGame(): string {
    const saveData = JSON.stringify(this.state);
    const timestamp = Date.now();
    this.state.lastSaved = timestamp;
    
    // In a real implementation, you would write to a file or database
    return saveData;
  }
  
  // Load a saved game state (basic implementation)
  loadGame(saveData: string): boolean {
    try {
      const loadedState = JSON.parse(saveData) as GameState;
      
      // Version compatibility check
      if (loadedState.version !== this.state.version) {
        console.warn(`Warning: Loading save from different version (${loadedState.version} vs current ${this.state.version})`);
      }
      
      this.state = loadedState;
      this.addJournal(`Game loaded successfully.`, 'event', 4);
      return true;
    } catch (error) {
      console.error("Failed to load game:", error);
      return false;
    }
  }
}