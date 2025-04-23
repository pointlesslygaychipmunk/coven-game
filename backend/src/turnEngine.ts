import type { GameStatus, GameState, GardenSlot, GardenSlotObject, Season, Weather } from '../../shared/types';

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
    if (!slot || typeof slot !== 'object' || !('type' in slot)) return slot;

    const { type, stage, age } = slot as GardenSlotObject;
    const growthCycles: Record<GardenSlotObject['type'], number> = {
      mushroom: 1,
      flower: 2,
      herb: 3,
      tree: 4
    };

    const isTree = type === 'tree';
    const baseCycles = growthCycles[type];
    const adjustedCycles = Math.ceil(baseCycles * totalModifier);
    const newAge = age + 1;

    if (isTree) {
      if (newAge >= adjustedCycles * 3) {
        return { type: 'tree', age: newAge, stage: 'decaying' } as GardenSlot;
      } else if (stage === 'young' && newAge >= adjustedCycles) {
        return { type: 'tree', age: newAge, stage: 'mature' } as GardenSlot;
      }
      return { type: 'tree', age: newAge, stage } as GardenSlot;
    }

    if (stage === 'young' && newAge >= adjustedCycles) {
      return { type, age: newAge, stage: 'mature' } as GardenSlot;
    } else if (stage === 'mature' && newAge >= adjustedCycles * 2) {
      return { type, age: newAge, stage: 'withered' } as GardenSlot;
    }

    return { type, age: newAge, stage } as GardenSlot;
  });

  return {
    ...gameState,
    player: {
      ...gameState.player,
      garden: {
        ...gameState.player.garden,
        spaces: updatedGarden
      }
    },
    status: {
      moonPhase: nextPhase,
      season: newSeason,
      year: newYear,
      weather: newWeather
    }
  };
}