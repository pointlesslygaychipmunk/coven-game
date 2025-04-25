// backend/moonLogic.ts
import type { Player, GameStatus, GardenSlot } from '../../shared/types';

export function simulateMoonPhaseChange(player: Player, gameStatus: GameStatus): void {
  const isFullMoon = gameStatus.moonPhase === 4; // assuming full moon is phase 4
  const decayWeather = ['stormy', 'foggy'];

  for (let i = 0; i < player.garden.length; i++) {
    const slot: GardenSlot = player.garden[i];
    if (!slot || typeof slot !== 'object') continue;

    // Tree logic
    if (slot.kind === 'tree') {
      if (!slot.isDead && slot.growth < 4) {
        if (isFullMoon && slot.growth === 1) {
          slot.growth = 2;
        } else {
          slot.growth += 1;
        }
      }

      if (!slot.isDead && decayWeather.includes(gameStatus.weather)) {
        if (Math.random() < 0.1) {
          slot.isDead = true;
        }
      }

      if (slot.growth >= 4 && isFullMoon && !slot.isDead) {
        player.mana += 1;
      }
    }

    // Crop logic
    if (slot.kind === 'crop') {
      if (!slot.isDead && slot.growth < 3) {
        slot.growth += 1;
      }

      if (!slot.isDead && decayWeather.includes(gameStatus.weather)) {
        if (Math.random() < 0.15) {
          slot.isDead = true;
        }
      }
    }
  }
}