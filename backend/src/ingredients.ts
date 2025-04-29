// backend/src/ingredients.ts
// Defines all plant ingredients, their properties, and growth requirements

import { ItemCategory, Season, MoonPhase } from "@shared/types";

// Full ingredient definition with growing properties
export interface Ingredient {
  name: string;
  category: ItemCategory;
  growthTime: number; // Number of growth cycles needed to mature
  description: string;
  primaryProperty: string; // Main skincare property
  secondaryProperty?: string; // Secondary skincare property
  bestSeason: Season; // Season when growth is optimal
  worstSeason: Season; // Season when growth is poorest
  idealMoonPhase?: MoonPhase; // Ideal moon phase for harvesting
  idealMoisture: number; // Ideal soil moisture (0-100)
  idealSunlight: number; // Ideal sunlight level (0-100)
  hanbangUsage?: string; // Traditional Hanbang usage description
  harvestBonus?: string; // Special bonus when harvested optimally
  mutationChance?: number; // Chance of mutation in certain conditions
  mutationTypes?: string[]; // Possible mutations
}

// Define all available ingredients with complete properties
export const INGREDIENTS: Ingredient[] = [
  {
    name: "Glimmerroot",
    category: "root",
    growthTime: 4,
    description: "A luminous root that grows stronger in sunlight. Provides firmness to skincare formulations.",
    primaryProperty: "firming",
    secondaryProperty: "brightening",
    bestSeason: "Spring",
    worstSeason: "Winter",
    idealMoonPhase: "Waxing Gibbous",
    idealMoisture: 60,
    idealSunlight: 80,
    hanbangUsage: "Used in traditional formulations to strengthen skin's structural integrity.",
    harvestBonus: "When harvested during Waxing Gibbous, contains 20% more active compounds."
  },
  {
    name: "Moonbud",
    category: "flower",
    growthTime: 3,
    description: "A silver-petaled flower that blooms at night and absorbs moonlight.",
    primaryProperty: "brightening",
    secondaryProperty: "rejuvenating",
    bestSeason: "Winter",
    worstSeason: "Summer",
    idealMoonPhase: "Full Moon",
    idealMoisture: 70,
    idealSunlight: 40,
    hanbangUsage: "Treasured ingredient in royal court beauty rituals for its illuminating properties.",
    harvestBonus: "Harvesting during Full Moon grants enhanced luminosity effect.",
    mutationChance: 0.2,
    mutationTypes: ["Prismatic", "Eternal"]
  },
  {
    name: "Silverleaf",
    category: "leaf",
    growthTime: 2,
    description: "Delicate silver-blue leaves with a silky texture. Excellent for sensitive skin.",
    primaryProperty: "soothing",
    secondaryProperty: "balancing",
    bestSeason: "Fall",
    worstSeason: "Summer",
    idealMoonPhase: "Waning Crescent",
    idealMoisture: 50,
    idealSunlight: 60,
    hanbangUsage: "Used to cool and calm inflammation in traditional remedies."
  },
  {
    name: "Sunpetal",
    category: "flower",
    growthTime: 3,
    description: "Vibrant yellow flowers that follow the sun. Fills potions with warmth and vitality.",
    primaryProperty: "energizing",
    secondaryProperty: "protective",
    bestSeason: "Summer",
    worstSeason: "Winter",
    idealMoonPhase: "First Quarter",
    idealMoisture: 50,
    idealSunlight: 90,
    hanbangUsage: "Added to formulations meant to protect from environmental damage."
  },
  {
    name: "Nightcap",
    category: "mushroom",
    growthTime: 2,
    description: "A deep purple mushroom that only grows in shade. Provides deep hydration.",
    primaryProperty: "hydrating",
    secondaryProperty: "detoxifying",
    bestSeason: "Fall",
    worstSeason: "Spring",
    idealMoonPhase: "New Moon",
    idealMoisture: 80,
    idealSunlight: 20,
    hanbangUsage: "Prized for its ability to draw moisture into the deepest skin layers.",
    mutationChance: 0.15,
    mutationTypes: ["Luminous", "Midnight"]
  },
  {
    name: "Everdew",
    category: "succulent",
    growthTime: 4,
    description: "A succulent that constantly produces tiny droplets of moisture from its leaves.",
    primaryProperty: "hydrating",
    secondaryProperty: "cooling",
    bestSeason: "Summer",
    worstSeason: "Winter",
    idealMoonPhase: "Waxing Crescent",
    idealMoisture: 30,
    idealSunlight: 70,
    hanbangUsage: "Used in summer formulations to maintain skin moisture balance."
  },
  {
    name: "Sweetshade",
    category: "root",
    growthTime: 3,
    description: "A pale, sweet-smelling root that grows in dappled light. Has calming properties.",
    primaryProperty: "soothing",
    secondaryProperty: "balancing",
    bestSeason: "Spring",
    worstSeason: "Fall",
    idealMoisture: 60,
    idealSunlight: 50,
    hanbangUsage: "Traditional remedy for sensitive, irritated skin."
  },
  {
    name: "Emberberry",
    category: "fruit",
    growthTime: 2,
    description: "Small red berries that feel warm to the touch. Stimulates circulation and renewal.",
    primaryProperty: "energizing",
    secondaryProperty: "exfoliating",
    bestSeason: "Summer",
    worstSeason: "Winter",
    idealMoonPhase: "Waxing Gibbous",
    idealMoisture: 50,
    idealSunlight: 80,
    hanbangUsage: "Added to formulations for mature skin to boost renewal."
  },
  {
    name: "Ancient Ginseng",
    category: "root",
    growthTime: 5,
    description: "A rare and potent form of ginseng with powerful rejuvenating properties.",
    primaryProperty: "rejuvenating",
    secondaryProperty: "nourishing",
    bestSeason: "Fall",
    worstSeason: "Spring",
    idealMoonPhase: "Full Moon",
    idealMoisture: 70,
    idealSunlight: 60,
    hanbangUsage: "The cornerstone of traditional Hanbang skincare, believed to harmonize energy.",
    harvestBonus: "When harvested after 5+ years, contains maximum beneficial compounds."
  },
  {
    name: "Sacred Lotus",
    category: "flower",
    growthTime: 4,
    description: "Pure white flowers that grow from the muddiest waters yet remain pristine.",
    primaryProperty: "purifying",
    secondaryProperty: "brightening",
    bestSeason: "Summer",
    worstSeason: "Winter",
    idealMoonPhase: "Full Moon",
    idealMoisture: 90,
    idealSunlight: 70,
    hanbangUsage: "Symbolizes purity in traditional medicine; used for brightening formulations.",
    harvestBonus: "When harvested at dawn, contains enhanced brightening compounds."
  },
  {
    name: "Frostherb",
    category: "herb",
    growthTime: 2,
    description: "An herb with icy blue leaves that feels cool to the touch, even in warm weather.",
    primaryProperty: "cooling",
    secondaryProperty: "soothing",
    bestSeason: "Winter",
    worstSeason: "Summer",
    idealMoonPhase: "Waning Crescent",
    idealMoisture: 40,
    idealSunlight: 50,
    hanbangUsage: "Used to cool and soothe irritated skin in traditional formulations."
  },
  {
    name: "Dawn Lily",
    category: "flower",
    growthTime: 3,
    description: "A pink lily that only opens at dawn. Contains natural exfoliating enzymes.",
    primaryProperty: "exfoliating",
    secondaryProperty: "clarifying",
    bestSeason: "Spring",
    worstSeason: "Fall",
    idealMoisture: 60,
    idealSunlight: 70,
    hanbangUsage: "Traditionally used to remove impurities and reveal fresh skin."
  }
];

// Seed variants of the ingredients
export const SEEDS = INGREDIENTS.map(ing => ({
  name: `${ing.name} Seed`,
  type: "seed",
  basePrice: 5 + Math.floor(ing.growthTime * 2),
  description: `Seeds for growing ${ing.name}. Best planted in ${ing.bestSeason}.`
}));

// Helper function to get ingredient data by name
export function getIngredientData(name: string): Ingredient | undefined {
  return INGREDIENTS.find(i => i.name === name);
}

// Calculate growth rate modifier based on growing conditions
export function calculateGrowthModifier(
  ingredient: Ingredient,
  currentSeason: Season,
  currentMoonPhase: MoonPhase,
  moisture: number,
  sunlight: number
): {
  growthModifier: number;
  factors: string[];
} {
  const factors: string[] = [];
  let modifier = 1.0; // Base modifier
  
  // Season effect
  if (currentSeason === ingredient.bestSeason) {
    modifier *= 1.5;
    factors.push(`Optimal season (${currentSeason}): +50% growth`);
  } else if (currentSeason === ingredient.worstSeason) {
    modifier *= 0.7;
    factors.push(`Challenging season (${currentSeason}): -30% growth`);
  }
  
  // Moon phase effect
  if (ingredient.idealMoonPhase && currentMoonPhase === ingredient.idealMoonPhase) {
    modifier *= 1.3;
    factors.push(`Ideal moon phase (${currentMoonPhase}): +30% growth`);
  }
  
  // Moisture effect
  const moistureDifference = Math.abs(moisture - ingredient.idealMoisture);
  if (moistureDifference < 10) {
    modifier *= 1.2;
    factors.push("Optimal moisture: +20% growth");
  } else if (moistureDifference > 30) {
    modifier *= 0.8;
    factors.push("Poor moisture conditions: -20% growth");
  }
  
  // Sunlight effect
  const sunlightDifference = Math.abs(sunlight - ingredient.idealSunlight);
  if (sunlightDifference < 10) {
    modifier *= 1.2;
    factors.push("Optimal sunlight: +20% growth");
  } else if (sunlightDifference > 30) {
    modifier *= 0.8;
    factors.push("Poor sunlight conditions: -20% growth");
  }
  
  return {
    growthModifier: modifier,
    factors
  };
}

// Calculate harvest quality based on growing conditions
export function calculateHarvestQuality(
  ingredient: Ingredient,
  currentSeason: Season,
  currentMoonPhase: MoonPhase,
  plantHealth: number,
  plantAge: number
): {
  quality: number;
  bonusFactors: string[];
} {
  const bonusFactors: string[] = [];
  let quality = 70; // Base quality
  
  // Plant health is the most important factor
  quality = plantHealth;
  
  // Age bonus (older plants yield better ingredients, up to a point)
  const ageBonus = Math.min(10, plantAge * 2);
  quality += ageBonus;
  if (ageBonus > 5) {
    bonusFactors.push(`Mature plant age: +${ageBonus} quality`);
  }
  
  // Moon phase bonus
  if (ingredient.idealMoonPhase && currentMoonPhase === ingredient.idealMoonPhase) {
    quality += 15;
    bonusFactors.push(`Harvested during ideal moon phase (${currentMoonPhase}): +15 quality`);
  }
  
  // Season bonus
  if (currentSeason === ingredient.bestSeason) {
    quality += 10;
    bonusFactors.push(`Harvested during best season (${currentSeason}): +10 quality`);
  } else if (currentSeason === ingredient.worstSeason) {
    quality -= 10;
    bonusFactors.push(`Harvested during worst season (${currentSeason}): -10 quality`);
  }
  
  // Special harvest bonus
  if (ingredient.harvestBonus && 
      ((ingredient.idealMoonPhase && currentMoonPhase === ingredient.idealMoonPhase) || 
       currentSeason === ingredient.bestSeason)) {
    quality += 10;
    bonusFactors.push(`Special harvest bonus: ${ingredient.harvestBonus}`);
  }
  
  // Cap quality
  quality = Math.min(100, Math.max(10, quality));
  
  return {
    quality,
    bonusFactors
  };
}

// Check if a plant can mutate and return mutation type if applicable
export function checkForMutation(
  ingredient: Ingredient,
  weather: string,
  moonPhase: MoonPhase,
  adjacentPlants: string[]
): string | null {
  if (!ingredient.mutationChance || !ingredient.mutationTypes) {
    return null;
  }
  
  // Base mutation chance
  let mutationChance = ingredient.mutationChance;
  
  // Increased chance during certain moon phases
  if (moonPhase === "Full Moon" || moonPhase === "New Moon") {
    mutationChance *= 1.5;
  }
  
  // Increased chance during stormy weather
  if (weather === "stormy") {
    mutationChance *= 1.3;
  }
  
  // Increased chance if certain plants are adjacent
  // This would be a more complex check in a real implementation
  
  // Check if mutation occurs
  if (Math.random() < mutationChance) {
    // Select a random mutation type
    const mutationType = ingredient.mutationTypes[Math.floor(Math.random() * ingredient.mutationTypes.length)];
    return mutationType;
  }
  
  return null;
}

// Get description of a plant's current growth stage
export function getGrowthStageDescription(
  ingredient: Ingredient,
  currentGrowth: number,
  maxGrowth: number
): string {
  const percentage = (currentGrowth / maxGrowth) * 100;
  
  if (percentage < 25) {
    return `Young ${ingredient.name} sprout, just beginning to develop.`;
  } else if (percentage < 50) {
    return `Growing ${ingredient.name}, showing characteristic features.`;
  } else if (percentage < 75) {
    return `Nearly mature ${ingredient.name}, developing its beneficial properties.`;
  } else if (percentage < 100) {
    return `Almost fully grown ${ingredient.name}, nearly ready for harvest.`;
  } else {
    return `Mature ${ingredient.name}, ready for harvest at optimal potency.`;
  }
}

// Group ingredients by category (for UI display, recipes, etc.)
export function groupIngredientsByCategory(): Record<ItemCategory, Ingredient[]> {
  const grouped: Partial<Record<ItemCategory, Ingredient[]>> = {};
  
  INGREDIENTS.forEach(ingredient => {
    if (!grouped[ingredient.category]) {
      grouped[ingredient.category] = [];
    }
    grouped[ingredient.category]!.push(ingredient);
  });
  
  return grouped as Record<ItemCategory, Ingredient[]>;
}

// Get ingredients that grow best in a specific season
export function getSeasonalIngredients(season: Season): Ingredient[] {
  return INGREDIENTS.filter(ing => ing.bestSeason === season);
}

// Get ingredients that benefit from a specific moon phase
export function getMoonPhaseIngredients(phase: MoonPhase): Ingredient[] {
  return INGREDIENTS.filter(ing => ing.idealMoonPhase === phase);
}