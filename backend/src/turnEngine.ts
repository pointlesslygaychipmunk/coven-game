import type {
  GameStatus,
  GameState,
  GardenSlot,
  Season,
  Weather,
} from "../../shared/types";
import { updateMarketAI } from "./marketLogic";
import { generateMarketEvent } from "./marketEvents";

export function advanceTurn(gameState: GameState): GameState {
  const { moonPhase, season, year, weather } = gameState.status;

  const nextPhase = (moonPhase % 56) + 1;
  const newYear = moonPhase === 56 ? year + 1 : year;

  const seasons: Season[] = ["Spring", "Summer", "Autumn", "Winter"];
  const nextSeasonIndex = (seasons.indexOf(season) + (nextPhase % 14 === 1 ? 1 : 0)) % 4;
  const newSeason: Season = seasons[nextSeasonIndex];

  const weatherOptions: Weather[] = ["Sunny", "Rainy", "Foggy", "Stormy", "Cloudy"];
  const newWeather: Weather =
    weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

  const seasonModifier: Record<Season, number> = {
    Spring: 1,
    Summer: 1,
    Autumn: 1,
    Winter: 1,
  };

  const weatherModifier: Record<Weather, number> = {
    Sunny: 1,
    Rainy: 1,
    Foggy: 1,
    Stormy: 1,
    Cloudy: 1,
  };

  const newPlayer = structuredClone(gameState.player);
  const newGarden = newPlayer.garden.spaces.map((slot) => {
    if (!slot || !("kind" in slot)) return slot;

    if (!slot.isDead) {
      slot.growth += 1;
    }

    // Passive fruit + mana generation from mature trees
    if (slot.kind === "tree" && slot.growth >= 3 && !slot.isDead) {
      newPlayer.inventory.fruit += 1;
      newPlayer.mana = Math.min(newPlayer.mana + 1, 10);
    }

    return slot;
  });

  // Reset actionsUsed and alerts
  newPlayer.garden.spaces = newGarden;
  newPlayer.alerts = [];
  const resetActionsUsed = 0;

  const memory = {
    purchases: { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
    sales: { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
  };

  let newMarket = updateMarketAI(gameState.market, memory);
  const event = generateMarketEvent(newSeason, nextPhase);
  const newMarketEvent = event
    ? { name: event.name, description: event.description }
    : null;
  if (event) newMarket = event.apply(newMarket);

  return {
    ...gameState,
    player: newPlayer,
    market: newMarket,
    marketEvent: newMarketEvent,
    status: {
      moonPhase: nextPhase,
      season: newSeason,
      year: newYear,
      weather: newWeather,
    },
    actionsUsed: resetActionsUsed,
  };
}