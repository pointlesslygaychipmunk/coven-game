// backend/src/turnEngine.ts

import { GameState, Season, Weather, MoonPhase } from '../../shared/types';
import { simulateMoonPhaseChange } from './logic/moonLogic';
import { updateMarket } from './modules/marketLogic';
import { recordMemoryEntry } from './modules/marketMemory';
import { generateRumors } from './modules/rumorEngine';
import { resolveQuests } from './modules/questSystem';
import { processBlackMarket } from './modules/blackMarket';
import { updateAscendancy } from './modules/ascendancy';

const seasonOrder: Season[] = ['spring', 'summer', 'autumn', 'winter'];
const weatherOptions: Weather[] = ['sunny', 'rainy', 'foggy', 'stormy', 'cloudy'];

export function advanceTurn(state: GameState): GameState {
  // Shallow-clone state for immutability
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
  const currentIdx = seasonOrder.indexOf(newState.status.season);
  newState.status.season = seasonOrder[(currentIdx + 1) % seasonOrder.length];

  // 2. Randomize weather
  newState.status.weather =
    weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

  // 3. Advance moon phase
  newState.status.moonPhase =
    ((newState.status.moonPhase + 1) % 8) as MoonPhase;

  // 4. Per-player moon-phase effects (garden growth, etc.)
  newState.players.forEach(player =>
    simulateMoonPhaseChange(player, newState.status)
  );

  // 5. Update market (prices, stock) based on status and players
  newState.market = updateMarket(
    newState.market,
    newState.status,
    newState.players
  );

  // 6. Record each player’s market memory
  newState.players.forEach(player =>
    recordMemoryEntry(player, newState.market, newState.status)
  );

  // 7. Generate and log new rumors
  const newRumors = generateRumors(newState);
  if (newRumors.length > 0) {
    newState.rumors.push(...newRumors);
    // Optionally broadcast to global journal
    newState.journal.push(
      ...newRumors.map(r => `Rumor surfaced: ${r.message}`)
    );
  }

  // 8. Resolve ritual quests and log completions
  newState.quests = resolveQuests(newState.quests, newState);
  // (questSystem can internally mark fulfilled and return updated array)

  // 9. Process black market mechanics
  Object.assign(newState, processBlackMarket(newState));

  // 10. Update ascendancy progress for each player
  newState.players.forEach(player => {
    const logEntry = updateAscendancy(player, newState);
    if (logEntry) {
      newState.journal.push(logEntry);
    }
  });

  // 11. Reset per-turn action counter
  newState.actionsUsed = 0;

  return newState;
}