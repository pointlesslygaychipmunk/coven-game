import { Player, GameStatus } from '../../shared/types';

export function simulateMoonPhaseChange(player: Player, gameStatus: GameStatus) {
  const fullMoon = gameStatus.moonPhase % 14 === 0;
  const decayWeather = ['stormy', 'gloomy'];

  for (let i = 0; i < player.garden.spaces.length; i++) {
    const slot = player.garden.spaces[i];
    if (slot && !('type' in slot)) {
      if (!slot.isDead && slot.growth < 4) {
        // Full Moon planting bonus
        if (fullMoon && slot.growth === 1) {
          slot.growth = 2;
        } else {
          slot.growth += 1;
        }
      }

      if (!slot.isDead && decayWeather.includes(gameStatus.weather)) {
        const decayChance = Math.random();
        if (decayChance < 0.10) {
          slot.isDead = true;
        }
      }

      if (slot.growth === 4 && !slot.isDead && fullMoon) {
        player.mana += 1;
      }
    }
  }
}
