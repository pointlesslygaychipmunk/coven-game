"use strict";
// backend/src/turnEngine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.advanceTurn = void 0;
// ← was './modules/marketLogic'—should come from logic/
const marketLogic_1 = require("./logic/marketLogic");
// moonLogic also lives under logic/
const moonLogic_1 = require("./logic/moonLogic");
const rumorEngine_1 = require("./modules/rumorEngine");
const questSystem_1 = require("./modules/questSystem");
const blackMarket_1 = require("./modules/blackMarket");
const ascendancy_1 = require("./modules/ascendancy");
const familiarPowers_1 = require("./modules/familiarPowers");
const seasonOrder = ['spring', 'summer', 'autumn', 'winter'];
const weatherOptions = ['sunny', 'rainy', 'foggy', 'stormy', 'cloudy'];
function advanceTurn(state) {
    const newState = {
        ...state,
        status: { ...state.status },
        players: state.players.map(p => ({ ...p })),
        market: { items: { ...state.market.items } },
        quests: state.quests.map(q => ({ ...q })),
        rumors: [...state.rumors],
        journal: [...state.journal],
    };
    // 1. Advance season
    const idx = seasonOrder.indexOf(newState.status.season);
    newState.status.season = seasonOrder[(idx + 1) % seasonOrder.length];
    // 2. Randomize weather
    newState.status.weather =
        weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    // 3. Advance moon phase
    newState.status.moonPhase = ((newState.status.moonPhase + 1) % 8);
    // 4. Per‐player moon‐phase effects
    newState.players.forEach(player => (0, moonLogic_1.simulateMoonPhaseChange)(player, newState.status));
    // 4.5. Apply familiar powers
    newState.players.forEach(player => (0, familiarPowers_1.applyFamiliarPowers)(player, newState));
    // 5. Update market
    newState.market = (0, marketLogic_1.updateMarket)(newState.market, newState.status, newState.players);
    // 7. Generate & log rumors
    const newRumors = (0, rumorEngine_1.generateRumors)(newState);
    if (newRumors.length) {
        newState.rumors.push(...newRumors);
        newState.journal.push(...newRumors.map(r => `Rumor: ${r.message}`));
    }
    // 8. Resolve quests
    newState.quests = (0, questSystem_1.resolveQuests)(newState.quests, newState);
    // 9. Process black market
    Object.assign(newState, (0, blackMarket_1.processBlackMarket)(newState));
    // 10. Ascendancy progress
    newState.players.forEach(player => {
        const entry = (0, ascendancy_1.updateAscendancy)(player, newState);
        if (entry)
            newState.journal.push(entry);
    });
    // 11. Reset actions
    newState.actionsUsed = 0;
    return newState;
}
exports.advanceTurn = advanceTurn;
