// backend/src/turnEngine.ts

import { GameState, Season, Weather, MoonPhase } from '../../shared/types';
// ← was './modules/marketLogic'—should come from logic/
import { updateMarket } from './logic/marketLogic';
// moonLogic also lives under logic/
import { simulateMoonPhaseChange } from './logic/moonLogic';

import { recordMemoryEntry } from './modules/marketMemory';
import { generateRumors }       from './modules/rumorEngine';
import { resolveQuests }        from './modules/questSystem';
import { processBlackMarket }   from './modules/blackMarket';
import { updateAscendancy }     from './modules/ascendancy';
import { applyFamiliarPowers } from './modules/familiarPowers';

const seasonOrder: Season[] = ['spring', 'summer', 'autumn', 'winter'];
const weatherOptions: Weather[] = ['sunny', 'rainy', 'foggy', 'stormy', 'cloudy'];

export function advanceTurn(state: GameState): GameState {
  const newState: GameState = {
    ...state,
    status:   { ...state.status },
    players:  state.players.map(p => ({ ...p })),
    market:   { items: { ...state.market.items } },
    quests:   state.quests.map(q => ({ ...q })),
    rumors:   [...state.rumors],
    journal:  [...state.journal],
  };

  // 1. Advance season
  const idx = seasonOrder.indexOf(newState.status.season);
  newState.status.season = seasonOrder[(idx + 1) % seasonOrder.length];

  // 2. Randomize weather
  newState.status.weather =
    weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

  // 3. Advance moon phase
  newState.status.moonPhase = ((newState.status.moonPhase + 1) % 8) as MoonPhase;

  // 4. Per‐player moon‐phase effects
  newState.players.forEach(player =>
    simulateMoonPhaseChange(player, newState.status)
  );

  // 4.5. Apply familiar powers
  newState.players.forEach(player =>
    applyFamiliarPowers(player, newState)
  );

  // 5. Update market
  newState.market = updateMarket(
    newState.market,
    newState.status,
    newState.players
  );

  // 7. Generate & log rumors
  const newRumors = generateRumors(newState);
  if (newRumors.length) {
    newState.rumors.push(...newRumors);
    newState.journal.push(...newRumors.map(r => `Rumor: ${r.message}`));
  }

  // 8. Resolve quests
  newState.quests = resolveQuests(newState.quests, newState);

  // 9. Process black market
  Object.assign(newState, processBlackMarket(newState));

  // 10. Ascendancy progress
  newState.players.forEach(player => {
    const entry = updateAscendancy(player, newState);
    if (entry) newState.journal.push(entry);
  });

  // 11. Reset actions
  newState.actionsUsed = 0;

  return newState;
}