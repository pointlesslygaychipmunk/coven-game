"use strict";
// backend/src/blackMarket.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlackMarketItem = void 0;
const uuid_1 = require("uuid");
const itemId = (0, uuid_1.v4)();
function getBlackMarketItem() {
    return {
        [itemId]: {
            type: "blackMarket",
            name: "Stolen petals",
            price: 50,
            stock: 2,
            riskLevel: 30,
            currentPrice: 50,
            rumors: [],
        },
    };
}
exports.getBlackMarketItem = getBlackMarketItem;
