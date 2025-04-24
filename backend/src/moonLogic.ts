// backend/moonLogic.ts
import type { Player, GameStatus } from '../../shared/types';

export function simulateMoonPhaseChange(player: Player, gameStatus: GameStatus) {
  const isFullMoon = gameStatus.moonPhase % 14 === 0;
  const decayWeather = ['Stormy', 'Foggy']; // must match `Weather` union from shared/types

  for (let i = 0; i < player.garden.spaces.length; i++) {
    const slot = player.garden.spaces[i];
    if (!slot || typeof slot !== 'object') continue;

    // Handle tree logic
    if (slot.kind === 'tree') {
      if (!slot.isDead && slot.growth < 4) {
        // Full Moon boost
        if (isFullMoon && slot.growth === 1) {
          slot.growth = 2;
        } else {
          slot.growth += 1;
        }
      }

      if (!slot.isDead && decayWeather.includes(gameStatus.weather)) {
        const decayChance = Math.random();
        if (decayChance < 0.1) {
          slot.isDead = true;
        }
      }

      if (slot.growth >= 4 && isFullMoon && !slot.isDead) {
        player.mana += 1;
      }
    }
  }
}