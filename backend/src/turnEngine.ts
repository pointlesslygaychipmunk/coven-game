// backend/src/turnEngine.ts – Corrected weather assignment and full turn engine
import type { GameState, Season, Weather } from '../../shared/src/types';
import { applyMarketEvents } from './marketEvents';
import { processBlackMarket } from './modules/blackMarket';
import updateAscendancy from './modules/ascendancy';
import { applyFamiliarPowers } from './modules/familiarPowers';
import { resolveQuests } from './modules/questSystem';
import { generateRumors } from "./modules/rumorEngine";
import { generateTownRequests } from './generateTownRequests';

/** Helper to get next season in order */
function nextSeason(current: Season): Season {
  const order: Season[] = ['spring', 'summer', 'autumn', 'winter'];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
}

/** Helper: get a random weather based on season */
function randomWeather(season: Season): Weather {
  const winterWeather: Weather[] = ['sunny', 'cloudy', 'foggy', 'snowy', 'stormy'];
  const normalWeather: Weather[] = ['sunny', 'cloudy', 'foggy', 'rainy', 'stormy'];
  const pool = (season === 'winter') ? winterWeather : normalWeather;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Advance game state by one moon phase */
export function nextTurn(state: GameState): GameState {
  if (state.status.moonPhase < 7) {
    state.status.moonPhase += 1;
  } else {
    state.status.moonPhase = 0;
    const oldSeason = state.status.season;
    const newSeason = nextSeason(oldSeason);
    state.status.season = newSeason;
    if (newSeason === 'spring' && oldSeason === 'winter') {
      state.status.year += 1;
    }
  }

  // Assign correct weather type
  state.status.weather = randomWeather(state.status.season);

  // Grow crops and check for weather damage
  const decayWeather: Weather[] = ['stormy', 'foggy'];
  state.players.forEach(player => {
    player.garden.forEach(slot => {
      if (!slot.crop) {
        slot.watered = false;
        return;
      }
      if (!slot.dead) {
        if (decayWeather.includes(state.status.weather)) {
          const deathChance = slot.kind === 'tree' ? 0.15 : 0.10;
          if (Math.random() < deathChance) {
            slot.dead = true;
          }
        }
        if (!slot.dead) {
          slot.growth = Math.min(1, slot.growth + 0.25);
        }
      }
      slot.watered = false;
    });
    player.wateringUsed = 0;
  });

  // Market events and rumor generation
  applyMarketEvents(state);
  processBlackMarket(state);
  state.quests = resolveQuests(state.quests, state);
  state.townRequests = generateTownRequests(state.townRequests, state.status);
  state.players.forEach(p => applyFamiliarPowers(p, state));
  state.players.forEach(p => updateAscendancy(state));
  const rumors = generateRumors(Object.values(state.market.items));
  rumors.forEach(r => state.rumors.push(r));  

  // Seasonal log
  if (state.status.moonPhase === 0) {
    state.journal.push(`⭐ The season has turned to ${state.status.season} of Year ${state.status.year}.`);
  }

  return state;
}
