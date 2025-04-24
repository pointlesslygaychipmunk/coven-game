import type { GameStatus, GameState, GardenSlot, GardenSlotObject, Season, Weather } from '../../shared/types';

import { updateMarketAI } from "./marketLogic";
import { generateMarketEvent } from "./marketEvents";
import type { MarketEvent } from "./marketEvents";

export function advanceTurn(gameState: GameState): GameState {
  let { moonPhase, season, year, weather } = gameState.status;
  const nextPhase = (moonPhase % 56) + 1;

  const seasons: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
  let newSeason: Season = season;
  if (nextPhase % 14 === 1) {
    const nextSeasonIndex = (seasons.indexOf(season) + 1) % 4;
    newSeason = seasons[nextSeasonIndex];
  }

  const weatherOptions: Weather[] = ['Sunny', 'Rainy', 'Foggy', 'Stormy', 'Cloudy'];
  const newWeather: Weather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

  const newYear = (moonPhase === 56) ? year + 1 : year;

  const seasonModifier: Record<Season, number> = {
    Spring: 0.8,
    Summer: 1.0,
    Autumn: 1.2,
    Winter: 1.5
  };

  const weatherModifier: Record<Weather, number> = {
    Sunny: 1.0,
    Rainy: 0.8,
    Foggy: 1.1,
    Stormy: 1.5,
    Cloudy: 1.3
  };

  const totalModifier = seasonModifier[newSeason] * weatherModifier[newWeather];

  const updatedGarden: GardenSlot[] = gameState.player.garden.spaces.map((slot): GardenSlot => {
    if (!slot || typeof slot !== 'object' || !('kind' in slot)) return slot;

    const newSlot = { ...slot };
    newSlot.growth += totalModifier;

    return newSlot;
  });

  // Passive resource gain from mature trees
  let newPlayer = structuredClone(gameState.player);
  for (const slot of updatedGarden) {
    if (slot && slot.kind === 'tree' && slot.growth >= 3 && !slot.isDead) {
      newPlayer.inventory.fruit += 1;
      newPlayer.mana += 1;
    }
  }

  // Dummy memory example — replace with actual tracking logic
  const memory = {
    purchases: { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
    sales: { mushroom: 0, flower: 0, herb: 0, fruit: 0 }
  };

  // Update market base state
  let newMarket = updateMarketAI(gameState.market, memory);

  // Try to generate an event
  const event = generateMarketEvent(newSeason, nextPhase);

  // Apply event if it exists
  const newMarketEvent = event
    ? { name: event.name, description: event.description }
    : null;

  if (event) {
    newMarket = event.apply(newMarket);
  }

  return {
    ...gameState,
    player: {
      ...newPlayer,
      garden: {
        ...newPlayer.garden,
        spaces: updatedGarden
      }
    },
    market: newMarket,
    marketEvent: newMarketEvent,
    status: {
      moonPhase: nextPhase,
      season: newSeason,
      year: newYear,
      weather: newWeather
    }
  };
}