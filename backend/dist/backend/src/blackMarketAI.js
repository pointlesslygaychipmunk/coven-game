"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustBlackMarketPrices = void 0;
function adjustBlackMarketPrices(marketItems) {
    for (const item of marketItems) {
        if ("basePrice" in item && typeof item.basePrice === "number") {
            const volatility = item.volatility ?? 0.2;
            const changeFactor = (Math.random() - 0.5) * volatility;
            const newPrice = item.basePrice * (1 + changeFactor);
            item.currentPrice = Math.max(1, Math.round(newPrice));
            item.price = item.currentPrice; // Ensure 'price' field remains in sync
        }
    }
}
exports.adjustBlackMarketPrices = adjustBlackMarketPrices;
