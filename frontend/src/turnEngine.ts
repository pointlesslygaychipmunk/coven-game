import { GameStatus } from '../../../shared/types';

export function advanceTurn(status: GameStatus): GameStatus {
  let { moonPhase, season, year, weather } = status;
  const nextPhase = (moonPhase % 56) + 1;

  // Simple seasonal structure: every 14 moons, season changes
  let newSeason = season;
  if (nextPhase % 14 === 1) {
    const seasons = ['spring', 'summer', 'fall', 'winter'];
    const nextSeasonIndex = (seasons.indexOf(season) + 1) % 4;
    newSeason = seasons[nextSeasonIndex];
  }

  // Simple weather roll
  const weatherOptions = ['clear', 'gloomy', 'stormy', 'blessed', 'foggy'];
  const newWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

  const newYear = (moonPhase === 56) ? year + 1 : year;

  return {
    moonPhase: nextPhase,
    season: newSeason,
    year: newYear,
    weather: newWeather
  };
}
