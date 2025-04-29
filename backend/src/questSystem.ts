// backend/src/questSystem.ts
// Manages ritual quest progression and completion

import { 
  GameState, RitualQuest, Player, MoonPhase, 
  Season, InventoryItem, JournalEntry 
} from "@shared/types";

// Define the master list of available ritual quests
export const RITUAL_QUESTS: RitualQuest[] = [
  // Essence Atelier Path
  {
    id: "essence_mastery",
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
      { type: 'skill', value: 'brewing' },
      { type: 'item', value: 'Lunaria Essence Stone' }
    ],
    requiredMoonPhase: undefined,
    requiredSeason: undefined,
    deadline: undefined,
    unlocked: true
  },
  
  // Fermentation Atelier Path
  {
    id: "fermentation_mastery",
    name: "Fermentation Mastery Ritual",
    description: "Learn the ancient art of herbal fermentation to create powerful skincare elixirs.",
    stepsCompleted: 0,
    totalSteps: 3,
    steps: [
      { description: "Collect 5 different herbs", completed: false },
      { description: "Successfully brew 3 different potions", completed: false },
      { description: "Create a Fermented Herb Essence during a Waning Moon", completed: false }
    ],
    rewards: [
      { type: 'skill', value: 'herbalism' },
      { type: 'item', value: 'Eternal Fermentation Jar' }
    ],
    requiredMoonPhase: undefined,
    requiredSeason: undefined,
    deadline: undefined,
    unlocked: true
  },
  
  // Seasonal Rituals
  {
    id: "spring_awakening",
    name: "Spring Awakening Ritual",
    description: "Harness the revitalizing energy of spring to enhance your garden's vitality.",
    stepsCompleted: 0,
    totalSteps: 3,
    steps: [
      { description: "Plant 3 different seeds during Spring", completed: false },
      { description: "Harvest a Glimmerroot with 85+ quality", completed: false },
      { description: "Craft a Spring Revival Tonic", completed: false }
    ],
    rewards: [
      { type: 'skill', value: 'gardening' },
      { type: 'item', value: 'Spring Essence Vial' }
    ],
    requiredSeason: "Spring",
    unlocked: false
  },
  
  {
    id: "summer_radiance",
    name: "Summer Radiance Ritual",
    description: "Channel the abundant energy of summer into your skincare creations.",
    stepsCompleted: 0,
    totalSteps: 3,
    steps: [
      { description: "Harvest 3 sun-loving herbs during Summer", completed: false },
      { description: "Create a Summer Glow Oil during the Full Moon", completed: false },
      { description: "Sell 3 potions at maximum market value", completed: false }
    ],
    rewards: [
      { type: 'gold', value: 100 },
      { type: 'item', value: 'Solar Infusion Stone' }
    ],
    requiredSeason: "Summer",
    unlocked: false
  },
  
  {
    id: "autumn_preservation",
    name: "Autumn Preservation Ritual",
    description: "Learn the secrets of preserving herbal potency through the autumn harvest.",
    stepsCompleted: 0,
    totalSteps: 3,
    steps: [
      { description: "Collect 5 autumn herbs before winter arrives", completed: false },
      { description: "Create a Preservation Elixir during a Waning Moon", completed: false },
      { description: "Trade with 3 different merchants", completed: false }
    ],
    rewards: [
      { type: 'skill', value: 'trading' },
      { type: 'reputation', value: 15 }
    ],
    requiredSeason: "Fall",
    unlocked: false
  },
  
  {
    id: "winter_reflection",
    name: "Winter Reflection Ritual",
    description: "Embrace the quiet stillness of winter to enhance your intuitive brewing abilities.",
    stepsCompleted: 0,
    totalSteps: 3,
    steps: [
      { description: "Meditate under the Full Moon in Winter", completed: false },
      { description: "Create a Dreamvision Potion", completed: false },
      { description: "Brew a potion with 95+ quality", completed: false }
    ],
    rewards: [
      { type: 'skill', value: 'brewing' },
      { type: 'skill', value: 'astrology' }
    ],
    requiredSeason: "Winter",
    unlocked: false
  },
  
  // Lunar Rituals
  {
    id: "lunar_harmony",
    name: "Lunar Harmony Ritual",
    description: "Attune yourself to the moon's cycles to enhance your brewing potency.",
    stepsCompleted: 0,
    totalSteps: 4,
    steps: [
      { description: "Create a potion during the New Moon", completed: false },
      { description: "Create a potion during the First Quarter", completed: false },
      { description: "Create a potion during the Full Moon", completed: false },
      { description: "Create a potion during the Last Quarter", completed: false }
    ],
    rewards: [
      { type: 'skill', value: 'astrology' },
      { type: 'item', value: 'Moonphase Chronometer' }
    ],
    unlocked: false
  },
  
  // Advanced Mastery Rituals (unlocked later)
  {
    id: "hanbang_mastery",
    name: "Hanbang Mastery Ritual",
    description: "Master the ancient Hanbang skincare traditions by creating a legendary formulation.",
    stepsCompleted: 0,
    totalSteps: 5,
    steps: [
      { description: "Reach level 5 in Brewing skill", completed: false },
      { description: "Collect all core Hanbang ingredients", completed: false },
      { description: "Create a Radiant Ginseng Elixir during a Full Moon", completed: false },
      { description: "Reach maximum reputation with the town", completed: false },
      { description: "Create the legendary Imperial Jade Essence", completed: false }
    ],
    rewards: [
      { type: 'item', value: 'Hanbang Master Certification' },
      { type: 'gold', value: 500 },
      { type: 'reputation', value: 50 }
    ],
    unlocked: false
  }
];

// Add a new ritual quest to a player's available quests
export function addRitualQuest(state: GameState, questId: string, playerId?: string): boolean {
  // Find the ritual template
  const questTemplate = RITUAL_QUESTS.find(q => q.id === questId);
  if (!questTemplate) {
    return false;
  }
  
  // Make a deep copy of the template
  const newQuest: RitualQuest = JSON.parse(JSON.stringify(questTemplate));
  newQuest.unlocked = true;
  
  // If no player specified, add to general game state
  if (!playerId) {
    // Check if the quest already exists
    if (state.rituals.some(r => r.id === questId)) {
      return false;
    }
    
    state.rituals.push(newQuest);
    addQuestJournalEntry(state, `A new ritual quest has become available: "${newQuest.name}"`);
    return true;
  }
  
  // If player specified, add to that player's quests
  const player = state.players.find(p => p.id === playerId);
  if (!player) {
    return false;
  }
  
  // If player doesn't have a quests array, initialize it
  if (!player.hasOwnProperty('quests')) {
    (player as any).quests = [];
  }
  
  // Add the quest to the player
  (player as any).quests.push(newQuest);
  addQuestJournalEntry(state, `${player.name} has discovered a new ritual quest: "${newQuest.name}"`);
  
  return true;
}

// Helper function to add a quest-related journal entry
function addQuestJournalEntry(state: GameState, text: string): void {
  const entry: JournalEntry = {
    id: state.journal.length + 1,
    turn: state.journal.length,
    date: `${state.time.phaseName}, ${state.time.season} Year ${state.time.year}`,
    text: text,
    category: 'ritual',
    importance: 4,
    readByPlayer: false
  };
  
  state.journal.push(entry);
}

// Check quest completion conditions based on player actions
export function checkQuestStepCompletion(
  state: GameState, 
  player: Player, 
  actionType: string, 
  actionDetails: any
): void {
  // Get active rituals
  const activeRituals = state.rituals.filter(ritual => 
    !player.completedRituals.includes(ritual.id) && 
    ritual.unlocked &&
    ritual.stepsCompleted < ritual.totalSteps
  );
  
  if (activeRituals.length === 0) return;
  
  // Check current conditions
  const currentPhase = state.time.phaseName;
  const currentSeason = state.time.season;
  
  // Process each active ritual
  activeRituals.forEach(ritual => {
    // Get the current uncompleted step
    const currentStepIndex = ritual.stepsCompleted;
    if (currentStepIndex >= ritual.steps.length) return;
    
    const currentStep = ritual.steps[currentStepIndex];
    if (currentStep.completed) return;
    
    // Check if the current action satisfies the step based on action type
    switch (actionType) {
      case 'brew':
        handleBrewingStepCheck(currentStep, actionDetails, currentPhase, currentSeason);
        break;
        
      case 'harvest':
        handleHarvestStepCheck(currentStep, actionDetails, player);
        break;
        
      case 'plant':
        handlePlantingStepCheck(currentStep, actionDetails, currentSeason);
        break;
        
      case 'sell':
        handleSellingStepCheck(currentStep, actionDetails);
        break;
        
      case 'meditate':
        handleMeditationStepCheck(currentStep, currentPhase, currentSeason);
        break;
        
      case 'skill':
        handleSkillStepCheck(currentStep, player);
        break;
        
      case 'collection':
        handleCollectionStepCheck(currentStep, player);
        break;
    }
    
    // If step was completed, update ritual progress
    if (currentStep.completed) {
      ritual.stepsCompleted++;
      
      // Add journal entry for step completion
      addQuestJournalEntry(
        state, 
        `Ritual progress: ${ritual.name} - Step ${ritual.stepsCompleted} of ${ritual.totalSteps} completed!`
      );
      
      // Check if ritual is now fully completed
      if (ritual.stepsCompleted >= ritual.totalSteps) {
        // Add completion journal entry
        addQuestJournalEntry(
          state,
          `Ritual complete: You have completed "${ritual.name}"! Visit your journal to claim rewards.`
        );
      }
    }
  });
}

// Check brewing-related quest steps
function handleBrewingStepCheck(
  step: { description: string, completed: boolean },
  actionDetails: any,
  currentPhase: MoonPhase,
  currentSeason: Season
): void {
  const { potionName, quality, moonPhase } = actionDetails;
  
  // Check for specific potion brewing
  if (step.description.includes(potionName)) {
    // Check for moon phase requirement
    if (step.description.includes("Full Moon") && currentPhase !== "Full Moon") {
      return;
    }
    if (step.description.includes("New Moon") && currentPhase !== "New Moon") {
      return;
    }
    if (step.description.includes("Waning Moon") && 
        !["Waning Gibbous", "Last Quarter", "Waning Crescent"].includes(currentPhase)) {
      return;
    }
    
    // Check for quality requirement
    if (step.description.includes("90+") && quality < 90) {
      return;
    }
    if (step.description.includes("95+") && quality < 95) {
      return;
    }
    
    // If all conditions are met, mark step as completed
    step.completed = true;
  }
  
  // Generic brewing quality check
  if (step.description.includes("brew a potion with") && step.description.includes("quality")) {
    const qualityThreshold = parseInt(step.description.match(/(\d+)\+/)![1]);
    if (quality >= qualityThreshold) {
      step.completed = true;
    }
  }
  
  // Check for brewing during specific moon phases
  if (step.description.includes("Create a potion during the")) {
    const requiredPhase = step.description.match(/during the ([A-Za-z\s]+)/)![1].trim();
    if (currentPhase === requiredPhase) {
      step.completed = true;
    }
  }
}

// Check harvesting-related quest steps
function handleHarvestStepCheck(
  step: { description: string, completed: boolean },
  actionDetails: any,
  player: Player
): void {
  const { plantName, quality } = actionDetails;
  
  // Check for specific plant harvesting with quality
  if (step.description.includes(plantName) && step.description.includes("quality")) {
    const qualityThreshold = parseInt(step.description.match(/(\d+)\+/)![1]);
    if (quality >= qualityThreshold) {
      step.completed = true;
    }
  }
  
  // Check for harvesting multiple of the same plant
  if (step.description.includes(`Harvest ${plantName}`)) {
    // For "Harvest X [Plants]" steps
    const countMatch = step.description.match(/Harvest (\d+)/);
    if (countMatch) {
      const requiredCount = parseInt(countMatch[1]);
      
      // Count harvested plants from inventory or track separately
      // This is simplistic - in a real implementation, track these during the action
      const harvestedCount = player.inventory
        .filter(item => item.name === plantName)
        .reduce((total, item) => total + item.quantity, 0);
      
      if (harvestedCount >= requiredCount) {
        step.completed = true;
      }
    }
  }
}

// Check planting-related quest steps
function handlePlantingStepCheck(
  step: { description: string, completed: boolean },
  actionDetails: any,
  currentSeason: Season
): void {
  const { seedName, count } = actionDetails;
  
  // Check for planting during specific seasons
  if (step.description.includes("Plant") && step.description.includes("during " + currentSeason)) {
    // For planting X different seeds
    if (step.description.includes("different seeds")) {
      const requiredCount = parseInt(step.description.match(/Plant (\d+)/)![1]);
      
      // In practice, you'd need to track this across multiple plantings
      // For this example, we'll just check if the current seed contributes to completion
      if (count >= requiredCount) {
        step.completed = true;
      }
    }
    // For planting specific seeds
    else if (step.description.includes(seedName.replace(" Seed", ""))) {
      step.completed = true;
    }
  }
}

// Check selling-related quest steps
function handleSellingStepCheck(
  step: { description: string, completed: boolean },
  actionDetails: any
): void {
  const { itemName, price, maxPrice } = actionDetails;
  
  // Check for selling items at maximum value
  if (step.description.includes("maximum market value")) {
    // Assume maxPrice is the current maximum possible price
    if (price >= maxPrice * 0.95) { // Within 5% of max
      // For selling multiple items
      if (step.description.includes("Sell")) {
        const countMatch = step.description.match(/Sell (\d+)/);
        if (countMatch) {
          const requiredCount = parseInt(countMatch[1]);
          // In practice, you'd need to track this across multiple sales
          step.completed = true; // Simplified for example
        }
      }
    }
  }
}

// Check meditation-related quest steps
function handleMeditationStepCheck(
  step: { description: string, completed: boolean },
  currentPhase: MoonPhase,
  currentSeason: Season
): void {
  if (step.description.includes("Meditate")) {
    // Check moon phase requirement
    if (step.description.includes("Full Moon") && currentPhase === "Full Moon") {
      // Check season requirement
      if (step.description.includes("in Winter")) {
        if (currentSeason === "Winter") {
          step.completed = true;
        }
      } else {
        // No season requirement
        step.completed = true;
      }
    }
  }
}

// Check skill-related quest steps
function handleSkillStepCheck(
  step: { description: string, completed: boolean },
  player: Player
): void {
  if (step.description.includes("Reach level")) {
    // Extract skill name and level
    const skillMatch = step.description.match(/level (\d+) in (\w+) skill/);
    if (skillMatch) {
      const requiredLevel = parseInt(skillMatch[1]);
      const skillName = skillMatch[2].toLowerCase();
      
      // Check player skill level
      const playerSkill = player.skills[skillName as keyof typeof player.skills];
      if (playerSkill && playerSkill >= requiredLevel) {
        step.completed = true;
      }
    }
  }
}

// Check collection-related quest steps
function handleCollectionStepCheck(
  step: { description: string, completed: boolean },
  player: Player
): void {
  // Check for collecting different types of herbs
  if (step.description.includes("Collect") && step.description.includes("different herbs")) {
    const countMatch = step.description.match(/Collect (\d+)/);
    if (countMatch) {
      const requiredCount = parseInt(countMatch[1]);
      
      // Count unique herbs in inventory
      const herbTypes = player.inventory
        .filter(item => item.category === 'herb')
        .map(item => item.name);
      
      const uniqueHerbCount = new Set(herbTypes).size;
      
      if (uniqueHerbCount >= requiredCount) {
        step.completed = true;
      }
    }
  }
  
  // Check for collecting specific sets of items
  if (step.description.includes("Collect all core Hanbang ingredients")) {
    // Define what counts as "core Hanbang ingredients"
    const coreIngredients = ["Ancient Ginseng", "Sacred Lotus", "Glimmerroot", "Moonbud", "Silverleaf"];
    
    // Check if player has all items
    const hasAllIngredients = coreIngredients.every(ingredient => 
      player.inventory.some(item => item.name === ingredient && item.quantity > 0)
    );
    
    if (hasAllIngredients) {
      step.completed = true;
    }
  }
}

// Progress rituals based on game state
export function progressRituals(state: GameState): void {
  // Unlock season-specific rituals
  unlockSeasonalRituals(state);
  
  // Check for any rituals with fulfilled conditions
  state.rituals.forEach(ritual => {
    // Skip completed or locked rituals
    if (ritual.stepsCompleted >= ritual.totalSteps || !ritual.unlocked) {
      return;
    }
    
    // Check if the ritual has a required moon phase and if it's currently that phase
    if (ritual.requiredMoonPhase && state.time.phaseName === ritual.requiredMoonPhase) {
      // If this is a specific moon phase ritual, auto-progress the first step that 
      // directly relates to that phase if the conditions match
      const stepIndex = ritual.steps.findIndex(step => 
        !step.completed && step.description.includes(ritual.requiredMoonPhase!)
      );
      
      if (stepIndex !== -1 && stepIndex === ritual.stepsCompleted) {
        ritual.steps[stepIndex].completed = true;
        ritual.stepsCompleted++;
        
        addQuestJournalEntry(
          state, 
          `The ${ritual.requiredMoonPhase} has helped you progress in the "${ritual.name}" ritual!`
        );
      }
    }
  });
}

// Unlock seasonal rituals when the appropriate season begins
function unlockSeasonalRituals(state: GameState): void {
  const currentSeason = state.time.season;
  
  // Get seasonal rituals that match the current season and aren't already unlocked
  const seasonalRituals = RITUAL_QUESTS.filter(quest => 
    quest.requiredSeason === currentSeason && 
    !state.rituals.some(r => r.id === quest.id)
  );
  
  // Add any matching seasonal rituals to the game
  seasonalRituals.forEach(ritual => {
    // Make a deep copy of the template
    const newRitual: RitualQuest = JSON.parse(JSON.stringify(ritual));
    newRitual.unlocked = true;
    
    state.rituals.push(newRitual);
    
    addQuestJournalEntry(
      state, 
      `The arrival of ${currentSeason} has unlocked a new ritual: "${newRitual.name}"`
    );
  });
}

// Award ritual rewards to a player
export function claimRitualRewards(state: GameState, player: Player, ritualId: string): boolean {
  // Find the completed ritual
  const ritual = state.rituals.find(r => r.id === ritualId);
  
  if (!ritual || ritual.stepsCompleted < ritual.totalSteps || player.completedRituals.includes(ritualId)) {
    return false;
  }
  
  // Mark as claimed
  player.completedRituals.push(ritualId);
  
  // Award rewards
  ritual.rewards.forEach(reward => {
    switch (reward.type) {
      case 'gold':
        player.gold += Number(reward.value);
        addQuestJournalEntry(state, `${player.name} received ${reward.value} gold from the "${ritual.name}" ritual.`);
        break;
        
      case 'item':
        // Would need a proper inventory-adding function here
        const itemName = String(reward.value);
        // Simplified - in the real system we'd use the addItemToInventory function
        player.inventory.push({
          id: `reward_${itemName.toLowerCase().replace(/\s/g, '_')}`,
          name: itemName,
          category: 'ritual_item',
          type: 'ritual_item',
          quantity: 1,
          quality: 100 // Reward items are top quality
        });
        addQuestJournalEntry(state, `${player.name} received a ${itemName} from the "${ritual.name}" ritual.`);
        break;
        
      case 'skill':
        const skillName = String(reward.value);
        if (player.skills[skillName as keyof typeof player.skills] !== undefined) {
          player.skills[skillName as keyof typeof player.skills] += 1;
          addQuestJournalEntry(state, `${player.name}'s ${skillName} skill increased from the "${ritual.name}" ritual.`);
        }
        break;
        
      case 'reputation':
        player.reputation += Number(reward.value);
        addQuestJournalEntry(state, `${player.name} gained ${reward.value} reputation from the "${ritual.name}" ritual.`);
        break;
    }
  });
  
  return true;
}

// Check if any rituals have been completed and need rewards
export function checkRitualCompletion(state: GameState): void {
  // For each player, check their rituals
  state.players.forEach(player => {
    // Find any completed rituals that haven't been claimed
    const completedRituals = state.rituals.filter(ritual => 
      ritual.stepsCompleted >= ritual.totalSteps && 
      !player.completedRituals.includes(ritual.id)
    );
    
    // Notify about completed rituals
    completedRituals.forEach(ritual => {
      addQuestJournalEntry(
        state,
        `${player.name} has completed the "${ritual.name}" ritual and can claim rewards!`
      );
    });
  });
}