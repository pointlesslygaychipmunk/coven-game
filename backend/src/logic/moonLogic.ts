// backend/src/logic/moonLogic.ts

import { Player, GameStatus, GardenSlot } from "../../../shared/src/types";

/**
 * Grow or decay garden slots when the moon phase advances.
 * - Crops always grow 1 step (max 3), can die in harsh weather.
 * - Trees grow faster on full moons, can die rarely in storms/fog.
 */
export function simulateMoonPhaseChange(
  player: Player,
  gameStatus: GameStatus
): void {
  const isFullMoon = gameStatus.moonPhase === 4;
  const decayWeather: GameStatus["weather"][] = ["stormy", "foggy"];

  player.garden.forEach((slot: GardenSlot) => {
    if (!slot) return;

    if (slot.kind === "tree") {
      if (!slot.isDead && slot.growth < 4) {
        // full‐moon bonus
        slot.growth += isFullMoon ? 2 : 1;
        if (slot.growth > 4) slot.growth = 4;
      }
      // weather‐driven decay
      if (!slot.isDead && decayWeather.includes(gameStatus.weather)) {
        if (Math.random() < 0.1) slot.isDead = true;
      }
    }

    if (slot.kind === "crop") {
      if (!slot.isDead && slot.growth < 3) {
        slot.growth += 1;
      }
      if (!slot.isDead && decayWeather.includes(gameStatus.weather)) {
        if (Math.random() < 0.15) slot.isDead = true;
      }
    }
  });
}