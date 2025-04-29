// frontend/src/utils/gameData.ts
// Utility functions to access and process game data

import { Recipe, MoonPhase, Season } from '@shared/types';

// Mock data for ingredients (would be fetched from backend in production)
const INGREDIENT_EFFECTS = [
  {
    name: "Moonbud",
    category: "flower",
    primaryProperty: "brightening",
    secondaryProperty: "rejuvenating",
    potency: 8,
    moonPhaseBonus: "Full Moon",
    seasonalBonus: "Winter"
  },
  {
    name: "Glimmerroot",
    category: "root",
    primaryProperty: "firming",
    secondaryProperty: "protective",
    potency: 7,
    moonPhaseBonus: "Waxing Gibbous",
    seasonalBonus: "Spring"
  },
  {
    name: "Ancient Ginseng",
    category: "root",
    primaryProperty: "rejuvenating",
    secondaryProperty: "nourishing",
    potency: 9,
    moonPhaseBonus: "New Moon",
    seasonalBonus: "Fall"
  },
  {
    name: "Sacred Lotus",
    category: "flower",
    primaryProperty: "brightening",
    secondaryProperty: "clarifying",
    potency: 8,
    moonPhaseBonus: "Full Moon",
    seasonalBonus: "Summer"
  },
  {
    name: "Silverleaf",
    category: "leaf",
    primaryProperty: "soothing",
    secondaryProperty: "protective",
    potency: 6,
    moonPhaseBonus: "Waning Crescent",
    seasonalBonus: "Fall"
  }
];

// Mock recipe data (would be fetched from backend in production)
const RECIPES: Recipe[] = [
  {
    id: "radiant_moon_mask",
    name: "Radiant Moon Mask",
    ingredients: [
      { itemName: "Ancient Ginseng", quantity: 1 },
      { itemName: "Sacred Lotus", quantity: 1 }
    ],
    result: "Radiant Moon Mask",
    resultQuantity: 1,
    difficulty: 3,
    method: "blending",
    baseIngredient: "Sacred Lotus",
    supportIngredients: ["Ancient Ginseng"],
    properties: ["brightening", "rejuvenating"],
    totalBrewingTime: 4,
    description: "A luxurious facial mask that brightens and rejuvenates skin with the power of Ancient Ginseng and Sacred Lotus.",
    unlocked: true,
    specialConditions: {
      moonPhase: "Full Moon"
    }
  },
  {
    id: "moon_glow_serum",
    name: "Moon Glow Serum",
    ingredients: [
      { itemName: "Moonbud", quantity: 1 },
      { itemName: "Glimmerroot", quantity: 1 }
    ],
    result: "Moon Glow Serum",
    resultQuantity: 1,
    difficulty: 2,
    method: "infusion",
    baseIngredient: "Moonbud",
    supportIngredients: ["Glimmerroot"],
    properties: ["brightening", "firming"],
    totalBrewingTime: 3,
    description: "A luminous facial serum that gives skin a moonlit glow while firming the complexion.",
    unlocked: true
  },
  {
    id: "ginseng_infusion",
    name: "Ginseng Infusion",
    ingredients: [
      { itemName: "Ancient Ginseng", quantity: 1 },
      { itemName: "Moonbud", quantity: 1 }
    ],
    result: "Ginseng Infusion",
    resultQuantity: 1,
    difficulty: 2,
    method: "infusion",
    baseIngredient: "Ancient Ginseng",
    supportIngredients: ["Moonbud"],
    properties: ["rejuvenating", "brightening"],
    totalBrewingTime: 3,
    description: "A potent tonic that revitalizes skin with the power of Ancient Ginseng enhanced by Moonbud extract.",
    unlocked: true
  }
];

// Get ingredient effect data
export function getIngredientEffect(ingredientName: string) {
  return INGREDIENT_EFFECTS.find(effect => effect.name === ingredientName);
}

// Get a recipe by name
export function getRecipeByName(recipeName: string) {
  return RECIPES.find(recipe => recipe.name === recipeName);
}

// Get a recipe by ingredients
export function getRecipeByIngredients(ing1: string, ing2: string) {
  return RECIPES.find(recipe => {
    const recipeIngs = recipe.ingredients.map(i => i.itemName);
    return recipeIngs.includes(ing1) && recipeIngs.includes(ing2);
  });
}

// Calculate optimal brewing moon phase for ingredient combination
export function getOptimalMoonPhase(ing1: string, ing2: string): MoonPhase | null {
  const recipe = getRecipeByIngredients(ing1, ing2);
  if (recipe?.specialConditions?.moonPhase) {
    return recipe.specialConditions.moonPhase;
  }
  
  // If no specific recipe moon phase, check ingredient affinities
  const effect1 = getIngredientEffect(ing1);
  const effect2 = getIngredientEffect(ing2);
  
  if (effect1?.moonPhaseBonus && effect2?.moonPhaseBonus) {
    if (effect1.moonPhaseBonus === effect2.moonPhaseBonus) {
      return effect1.moonPhaseBonus;
    }
  }
  
  return effect1?.moonPhaseBonus || effect2?.moonPhaseBonus || null;
}

// Calculate optimal brewing season for ingredient combination
export function getOptimalSeason(ing1: string, ing2: string): Season | null {
  const recipe = getRecipeByIngredients(ing1, ing2);
  if (recipe?.specialConditions?.season) {
    return recipe.specialConditions.season;
  }
  
  // If no specific recipe season, check ingredient affinities
  const effect1 = getIngredientEffect(ing1);
  const effect2 = getIngredientEffect(ing2);
  
  if (effect1?.seasonalBonus && effect2?.seasonalBonus) {
    if (effect1.seasonalBonus === effect2.seasonalBonus) {
      return effect1.seasonalBonus;
    }
  }
  
  return effect1?.seasonalBonus || effect2?.seasonalBonus || null;
}

// Get available recipes for player based on discovered recipes
export function getAvailableRecipes(knownRecipes: string[]) {
  return RECIPES.filter(recipe => 
    knownRecipes.includes(recipe.name) || recipe.unlocked
  );
}

// Get brewing success chance based on current conditions
export function calculateBrewingSuccess(
  recipe: Recipe | undefined,
  currentMoonPhase: MoonPhase,
  currentSeason: Season,
  ingredientQualities: number[],
  brewingSkill: number = 1
): {
  successChance: number;
  potency: number;
  bonusFactors: string[];
} {
  if (!recipe) {
    return {
      successChance: 0,
      potency: 0,
      bonusFactors: []
    };
  }
  
  let successChance = 0.7; // Base 70% chance
  let potency = 1.0; // Base potency multiplier
  const bonusFactors: string[] = [];
  
  // Ingredient quality affects chance and potency
  const avgQuality = ingredientQualities.reduce((sum, q) => sum + q, 0) / ingredientQualities.length;
  successChance += (avgQuality - 70) / 200; // +/- 15% based on quality
  potency *= avgQuality / 70; // Scale potency by quality
  
  if (avgQuality > 80) {
    bonusFactors.push(`High quality ingredients (${Math.round(avgQuality)}%)`);
  }
  
  // Moon phase bonus
  const optimalMoonPhase = recipe.specialConditions?.moonPhase;
  if (optimalMoonPhase === currentMoonPhase) {
    successChance += 0.15;
    potency += 0.3;
    bonusFactors.push(`Optimal moon phase: ${currentMoonPhase}`);
  }
  
  // Season bonus
  const optimalSeason = recipe.specialConditions?.season;
  if (optimalSeason === currentSeason) {
    successChance += 0.1;
    potency += 0.2;
    bonusFactors.push(`Optimal season: ${currentSeason}`);
  }
  
  // Brewing skill
  successChance += brewingSkill * 0.05; // +5% per level
  potency += (brewingSkill - 1) * 0.1; // +10% per level after first
  
  if (brewingSkill > 1) {
    bonusFactors.push(`Brewing skill bonus (level ${brewingSkill})`);
  }
  
  // Cap success chance
  successChance = Math.min(0.95, Math.max(0.5, successChance));
  
  return {
    successChance,
    potency,
    bonusFactors
  };
}

// Format brewing properties with emoji icons
export function formatBrewingProperty(property: string): string {
  const propertyIcons: Record<string, string> = {
    'brightening': '✨',
    'rejuvenating': '🌱',
    'firming': '💪',
    'hydrating': '💧',
    'soothing': '🌿',
    'balancing': '⚖️',
    'protective': '🛡️',
    'purifying': '🌊'
  };
  
  return `${propertyIcons[property] || ''} ${property.charAt(0).toUpperCase() + property.slice(1)}`;
}

// Get appropriate weather tip based on current state
export function getWeatherTip(weather: string): string {
  switch (weather) {
    case 'rainy':
      return "Rain naturally waters your garden, helping plants grow without manual watering.";
    case 'dry':
      return "Water your plants promptly in dry weather to prevent withering.";
    case 'foggy':
      return "Foggy weather maintains moisture levels. Good for delicate plants.";
    case 'windy':
      return "Wind may cause plant mutations. Watch for special traits developing.";
    case 'stormy':
      return "Storms provide water but may damage plants. Check your garden after the storm.";
    default:
      return "Normal weather is balanced for all garden activities.";
  }
}

// Get moon phase gardening tip
export function getMoonPhaseTip(phase: MoonPhase): string {
  switch (phase) {
    case 'New Moon':
      return "Best time for planting new seeds, especially root crops.";
    case 'Waxing Crescent':
      return "Good for growth. Plants establish strong roots during this phase.";
    case 'First Quarter':
      return "Balanced energy. Good for most garden activities.";
    case 'Waxing Gibbous':
      return "Strong growth energy. Plants absorb nutrients efficiently.";
    case 'Full Moon':
      return "Perfect for harvesting and brewing potent potions. Plants at peak potency.";
    case 'Waning Gibbous':
      return "Good for harvesting roots and pruning. Energy moves downward.";
    case 'Last Quarter':
      return "Rest phase. Good for garden maintenance and soil preparation.";
    case 'Waning Crescent':
      return "Conservation phase. Minimal gardening advised.";
    default:
      return "Pay attention to the moon's cycle for optimal gardening results.";
  }
}

// Format currency with gold icon
export function formatGold(amount: number): string {
  return `${amount} ✨`;
}

// Get appropriate icon for item type/category
export function getItemIcon(type: string, category?: string): string {
  if (category) {
    switch (category) {
      case 'herb': return '🌿';
      case 'flower': return '🌸';
      case 'mushroom': return '🍄';
      case 'fruit': return '🍇';
      case 'root': return '🥕';
      case 'leaf': return '🍃';
      case 'essence': return '✨';
      case 'oil': return '💧';
      case 'crystal': return '💎';
      case 'water': return '💦';
    }
  }
  
  switch (type) {
    case 'seed': return '🌱';
    case 'ingredient': return '🌿';
    case 'potion': return '🧪';
    case 'tool': return '🔨';
    case 'ritual_item': return '✨';
    default: return '📦';
  }
}