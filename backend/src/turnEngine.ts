// backend/src/turnEngine.ts
// Handles advancing the game state by one lunar phase (and possibly season/year)
// Manages weather changes, plant growth, and time progression

import { 
  GameState, Season, WeatherFate, MoonPhase, Plant, 
  GardenSlot, GameTime, JournalEntry 
} from "@shared/types";

// Ordered arrays for moon phases and seasons
const MoonPhases: MoonPhase[] = [
  "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
  "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
];

const Seasons: Season[] = ["Spring", "Summer", "Fall", "Winter"];

// Advance to the next season in order
function nextSeason(current: Season): Season {
  const idx = Seasons.indexOf(current);
  return Seasons[(idx + 1) % Seasons.length];
}

// Randomly determine weather fate for a given season with seasonal weighting
function randomWeather(season: Season): WeatherFate {
  // Base chances for each weather type, varies by season
  const weatherChances: Record<Season, Record<WeatherFate, number>> = {
    "Spring": { "normal": 0.4, "rainy": 0.4, "dry": 0.1, "foggy": 0.1, "windy": 0.0, "stormy": 0.0 },
    "Summer": { "normal": 0.3, "rainy": 0.2, "dry": 0.4, "foggy": 0.0, "windy": 0.0, "stormy": 0.1 },
    "Fall":   { "normal": 0.3, "rainy": 0.3, "dry": 0.1, "foggy": 0.2, "windy": 0.1, "stormy": 0.0 },
    "Winter": { "normal": 0.4, "rainy": 0.1, "dry": 0.2, "foggy": 0.2, "windy": 0.1, "stormy": 0.0 }
  };
  
  // Get chances for current season
  const chances = weatherChances[season];
  
  // Basic weighted random selection
  const roll = Math.random();
  let cumulativeChance = 0;
  
  for (const [weather, chance] of Object.entries(chances)) {
    cumulativeChance += chance;
    if (roll < cumulativeChance) {
      return weather as WeatherFate;
    }
  }
  
  // Fallback to normal weather (shouldn't reach here if probabilities sum to 1)
  return "normal";
}

// Process growth, withering, and weather effects for a single plant
function applyGrowthAndWeather(
  plant: Plant,
  slot: GardenSlot,
  weather: WeatherFate,
  currentPhase: MoonPhase,
  currentSeason: Season
): { 
  didGrow: boolean,
  didWither: boolean,
  becameMature: boolean,
  message?: string 
} {
  if (!plant) return { didGrow: false, didWither: false, becameMature: false };
  
  const result = {
    didGrow: false,
    didWither: false,
    becameMature: false,
    message: undefined as string | undefined
  };
  
  // Track initial state for comparison
  const initialGrowth = plant.growth;
  const wasWatered = plant.watered;
  
  // Watering/weather analysis
  const isRainy = (weather === "rainy" || weather === "stormy");
  const isDry = (weather === "dry");
  const isWatered = wasWatered || isRainy;
  
  // Plant needs water to grow
  if (isWatered) {
    // Calculate growth increment
    let growthIncrease = 1; // Base growth
    
    // Apply seasonal modifier
    growthIncrease *= plant.seasonalModifier || 1.0;
    
    // Apply fertility bonus from garden slot
    growthIncrease *= (slot.fertility / 70); // Normalize around 1.0
    
    // Lunar phase influence:
    // - Full Moon boosts growth
    // - New Moon slows growth
    if (currentPhase === "Full Moon") {
      growthIncrease *= 1.5; // 50% more growth on Full Moon
      
      // Moon-blessed plants get extra growth during Full Moon
      if (plant.moonBlessed) {
        growthIncrease *= 1.3;
      }
    } else if (currentPhase === "New Moon") {
      growthIncrease *= 0.8; // 20% less growth on New Moon
    }
    
    // Round growth to nearest 0.1
    growthIncrease = Math.round(growthIncrease * 10) / 10;
    
    // Apply growth
    plant.growth += growthIncrease;
    plant.age += 1;
    result.didGrow = true;
    
    // Check if plant just matured
    if (initialGrowth < plant.maxGrowth && plant.growth >= plant.maxGrowth) {
      plant.mature = true;
      result.becameMature = true;
      result.message = `${plant.name} has matured and is ready for harvest!`;
    }
    
    // Cap growth at max
    if (plant.growth > plant.maxGrowth) {
      plant.growth = plant.maxGrowth;
    }
    
    // Improve plant health when watered, but not above 100
    plant.health = Math.min(100, plant.health + 5);
  } else {
    // Plant wasn't watered - decrease health
    plant.health = Math.max(0, plant.health - 15);
    
    // Increase death chance based on health
    plant.deathChance = (100 - plant.health) / 100;
    
    // In dry weather, plants suffer more without water
    if (isDry) {
      plant.health = Math.max(0, plant.health - 10);
      plant.deathChance += 0.2;
    }
    
    // Check if plant withers due to neglect
    if (plant.health <= 0 || (Math.random() < plant.deathChance)) {
      result.didWither = true;
      result.message = `${plant.name} has withered away due to lack of water.`;
    }
  }
  
  // Weather events and special effects
  switch (weather) {
    case "stormy":
      // Stormy weather can damage plants
      const stormDamage = Math.random() < 0.3; // 30% chance of damage
      if (stormDamage) {
        plant.health = Math.max(0, plant.health - 20);
        result.message = `The storm has damaged ${plant.name}!`;
        
        if (plant.health <= 0) {
          result.didWither = true;
          result.message = `${plant.name} was destroyed by the storm!`;
        }
      }
      break;
      
    case "windy":
      // Windy weather can cause cross-pollination (mutation chance)
      const mutationChance = Math.random() < 0.15; // 15% chance of mutation
      if (mutationChance && plant.growth > 1) {
        if (!plant.mutations) plant.mutations = [];
        
        // Simple mutation effects (we'd expand this in a full implementation)
        const possibleMutations = [
          "vibrant", "hardy", "fragrant", "potent", "luminous",
          "crisp", "tender", "colorful", "giant", "miniature"
        ];
        
        // Add a random mutation if plant doesn't already have it
        const newMutation = possibleMutations[Math.floor(Math.random() * possibleMutations.length)];
        if (!plant.mutations.includes(newMutation)) {
          plant.mutations.push(newMutation);
          result.message = `The winds have caused ${plant.name} to develop a ${newMutation} mutation!`;
          
          // Mutations can improve plant quality
          plant.qualityModifier = (plant.qualityModifier || 1.0) + 0.1;
        }
      }
      break;
      
    case "foggy":
      // Foggy weather preserves moisture but slows growth
      slot.moisture = Math.min(100, slot.moisture + 5);
      break;
  }
  
  // Reset watered status for next turn (water does not carry over)
  plant.watered = false;
  
  return result;
}

// Advance the game state by one lunar phase (one "turn" of the world)
export function processTurn(state: GameState): GameState {
  // Keep track of events to report
  const events: string[] = [];
  
  // Store current time values
  const oldPhase = state.time.phase;
  const oldPhaseName = state.time.phaseName;
  const oldSeason = state.time.season;
  
  // Advance moon phase index
  state.time.phase += 1;
  if (state.time.phase >= MoonPhases.length) {
    // Cycle back to New Moon and advance season
    state.time.phase = 0;
    const newSeason = nextSeason(oldSeason);
    state.time.season = newSeason;
    
    if (newSeason === "Spring" && oldSeason === "Winter") {
      state.time.year += 1; // new year when wrapping from Winter to Spring
      events.push(`A new year has begun! Welcome to Year ${state.time.year}.`);
    }
    
    events.push(`The season has changed from ${oldSeason} to ${state.time.season}.`);
  }
  
  // Update phase name string
  state.time.phaseName = MoonPhases[state.time.phase];
  events.push(`The moon has changed from ${oldPhaseName} to ${state.time.phaseName}.`);
  
  // Store previous weather for continuity
  state.time.previousWeatherFate = state.time.weatherFate;
  
  // Determine new weather for this phase
  state.time.weatherFate = determineWeather(state.time);
  events.push(`The weather is now ${state.time.weatherFate}.`);
  
  // Apply plant growth and weather effects for each player
  state.players.forEach(player => {
    player.garden.forEach(slot => {
      if (!slot.plant) return;
      
      const plant = slot.plant;
      const result = applyGrowthAndWeather(
        plant, 
        slot,
        state.time.weatherFate,
        state.time.phaseName,
        state.time.season
      );
      
      // Add any messages to events list
      if (result.message) {
        events.push(result.message);
      }
      
      // Handle plant death if it occurred
      if (result.didWither) {
        slot.plant = null;
        slot.fertility = Math.max(60, slot.fertility - 5); // Slight fertility loss when plant dies
      }
      
      // Process garden moisture updates based on weather
      updateGardenMoisture(slot, state.time.weatherFate);
    });
  });
  
  // Add journal entries for important events
  if (events.length > 0) {
    state.journal.push(...events.map((text, i) => {
      const journalEntry: JournalEntry = {
        id: state.journal.length + i + 1,
        turn: state.journal.length + i,
        date: `${state.time.phaseName}, ${state.time.season} Year ${state.time.year}`,
        text: text,
        category: text.includes("weather") ? "event" : 
                 text.includes("moon") ? "moon" : 
                 text.includes("season") ? "season" : "event",
        importance: text.includes("matured") ? 4 :
                   text.includes("withered") ? 3 :
                   text.includes("mutation") ? 4 : 2,
        readByPlayer: false
      };
      return journalEntry;
    }));
  }
  
  return state;
}

// Determine weather with some correlation to previous weather and season
function determineWeather(time: GameTime): WeatherFate {
  const previousWeather = time.weatherFate;
  const season = time.season;
  
  // Weather persistence: 30% chance the weather stays the same
  if (Math.random() < 0.3 && previousWeather) {
    return previousWeather;
  }
  
  // Otherwise, roll for new weather based on season
  return randomWeather(season);
}

// Update garden moisture levels based on weather
function updateGardenMoisture(slot: GardenSlot, weather: WeatherFate): void {
  // Base evaporation rate (moisture loss each turn)
  let evaporation = 10;
  
  // Weather affects moisture
  switch (weather) {
    case "rainy":
      // Rain adds moisture
      slot.moisture = Math.min(100, slot.moisture + 40);
      evaporation = 0;
      break;
      
    case "stormy":
      // Storms add a lot of moisture
      slot.moisture = 100;
      evaporation = 0;
      break;
      
    case "dry":
      // Dry weather increases evaporation
      evaporation = 25;
      break;
      
    case "foggy":
      // Fog reduces evaporation
      evaporation = 5;
      break;
      
    case "windy":
      // Wind increases evaporation
      evaporation = 15;
      break;
      
    default: // normal
      evaporation = 10;
      break;
  }
  
  // Apply evaporation
  slot.moisture = Math.max(0, slot.moisture - evaporation);
}