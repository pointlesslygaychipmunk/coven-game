import { GameState, Season, Weather, MoonPhase } from '../../shared/types';
import { simulateMoonPhaseChange } from './moonLogic';
import { updateMarketAI, MarketMemory } from './updateMarketAI';
import { applyMarketEvents } from './marketEvents';

const seasonOrder: Season[] = ['spring', 'summer', 'autumn', 'winter'];
const weatherOrder: Weather[] = ['sunny', 'rainy', 'foggy', 'stormy', 'cloudy'];

export function advanceTurn(state: GameState, memory: MarketMemory): GameState {
  const newState = { ...state };

  const currentSeasonIndex = seasonOrder.indexOf(newState.status.season);
  newState.status.season = seasonOrder[(currentSeasonIndex + 1) % seasonOrder.length];

  newState.status.weather = weatherOrder[Math.floor(Math.random() * weatherOrder.length)];
  newState.status.moonPhase = ((newState.status.moonPhase + 1) % 8) as MoonPhase;

  for (const player of newState.players) {
    simulateMoonPhaseChange(player, newState.status);
  }

  newState.market = updateMarketAI(newState.market, memory);
  applyMarketEvents(newState.market, newState.status.season, newState.status.moonPhase); 

  return newState;
}