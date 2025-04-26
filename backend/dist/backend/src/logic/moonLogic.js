"use strict";
// backend/src/logic/moonLogic.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateMoonPhaseChange = void 0;
/**
 * Grow or decay garden slots when the moon phase advances.
 * - Crops always grow 1 step (max 3), can die in harsh weather.
 * - Trees grow faster on full moons, can die rarely in storms/fog.
 */
function simulateMoonPhaseChange(player, gameStatus) {
    const isFullMoon = gameStatus.moonPhase === 4;
    const decayWeather = ["stormy", "foggy"];
    player.garden.forEach((slot) => {
        if (!slot)
            return;
        if (slot.kind === "tree") {
            if (!slot.isDead && slot.growth < 4) {
                // full‐moon bonus
                slot.growth += isFullMoon ? 2 : 1;
                if (slot.growth > 4)
                    slot.growth = 4;
            }
            // weather‐driven decay
            if (!slot.isDead && decayWeather.includes(gameStatus.weather)) {
                if (Math.random() < 0.1)
                    slot.isDead = true;
            }
        }
        if (slot.kind === "crop") {
            if (!slot.isDead && slot.growth < 3) {
                slot.growth += 1;
            }
            if (!slot.isDead && decayWeather.includes(gameStatus.weather)) {
                if (Math.random() < 0.15)
                    slot.isDead = true;
            }
        }
    });
}
exports.simulateMoonPhaseChange = simulateMoonPhaseChange;
