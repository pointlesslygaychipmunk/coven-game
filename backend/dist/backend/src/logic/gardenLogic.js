"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countLiving = exports.waterGarden = exports.growGarden = void 0;
function growGarden(garden) {
    return garden.map((slot) => {
        if (slot.isDead)
            return slot;
        const newGrowth = slot.growth + 1;
        return {
            ...slot,
            growth: newGrowth,
            isDead: newGrowth > 6,
        };
    });
}
exports.growGarden = growGarden;
function waterGarden(garden) {
    return garden.map((slot) => slot.isDead ? slot : { ...slot, watered: true });
}
exports.waterGarden = waterGarden;
function countLiving(garden, type) {
    return garden.filter((slot) => slot.type === type && !slot.isDead).length;
}
exports.countLiving = countLiving;
