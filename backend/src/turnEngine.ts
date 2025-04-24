// backend/turnEngine.ts

import type { GameState, Season, Weather, GardenSlot } from "../../shared/types";
import { updateMarketAI } from "./marketLogic";
import { generateMarketEvent } from "./marketEvents";

const SEASON_ORDER: Season[] = ["Spring", "Summer", "Autumn", "Winter"];
const WEATHER_OPTIONS: Weather[] = ["Sunny", "Rainy", "Foggy", "Stormy", "Cloudy"];

export function advanceTurn(gameState: GameState): GameState {
  const updated = structuredClone(gameState);

  // 🌙 Moon and Season
  const nextMoon = (updated.status.moonPhase % 56) + 1;
  const newYear = nextMoon === 1 ? updated.status.year + 1 : updated.status.year;

  const newSeason =
    nextMoon % 14 === 1
      ? SEASON_ORDER[(SEASON_ORDER.indexOf(updated.status.season) + 1) % 4]
      : updated.status.season;

  const newWeather = WEATHER_OPTIONS[Math.floor(Math.random() * WEATHER_OPTIONS.length)];

  // 📈 Growth and Decay
  const fullMoon = nextMoon % 14 === 0;
  const decayWeather = ["Stormy", "Foggy"];
  let treeFruitGained = 0;
  let treeManaGained = 0;
  const newGarden: GardenSlot[] = updated.player.garden.spaces.map((slot) => {
    if (!slot) return null;

    if (slot.isDead) return slot;

    slot.growth += 1;

    if (slot.kind === "tree" && slot.growth >= 3) {
      updated.player.inventory.fruit += 1;
      updated.player.mana += 1;
      treeFruitGained++;
      treeManaGained++;
    }

    if (decayWeather.includes(newWeather)) {
      const chance = Math.random();
      if (chance < 0.1) {
        slot.isDead = true;
      }
    }

    return slot;
  });

  // 🧠 Market logic (placeholder memory — replace later)
  const memory = {
    purchases: { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
    sales: { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
  };
  let newMarket = updateMarketAI(updated.market, memory);

  const event = generateMarketEvent(newSeason, nextMoon);
  const newMarketEvent = event ? { name: event.name, description: event.description } : null;
  if (event) newMarket = event.apply(newMarket);

  // 🧾 Alerts
  const alerts = [`🌙 The moon advances to phase ${nextMoon}.`];
  if (treeFruitGained) alerts.push(`🍎 ${treeFruitGained} fruit dropped from trees.`);
  if (treeManaGained) alerts.push(`✨ ${treeManaGained} mana harvested from trees.`);
  if (decayWeather.includes(newWeather)) alerts.push("💀 A foul weather risks killing your crops...");

  updated.player.alerts = [...(updated.player.alerts || []), ...alerts];

  return {
    ...updated,
    status: {
      year: newYear,
      season: newSeason,
      moonPhase: nextMoon,
      weather: newWeather,
    },
    market: newMarket,
    marketEvent: newMarketEvent,
    player: {
      ...updated.player,
      garden: {
        ...updated.player.garden,
        spaces: newGarden,
      },
    },
  };
}