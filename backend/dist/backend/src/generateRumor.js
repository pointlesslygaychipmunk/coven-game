"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRumor = void 0;
function generateRumor(item) {
    const label = "label" in item && item.label ? item.label : "Unknown Item";
    const direction = Math.random() > 0.5 ? "rising" : "falling";
    const message = `${label} prices may be ${direction} soon...`;
    return {
        id: crypto.randomUUID(),
        message
    };
}
exports.generateRumor = generateRumor;
