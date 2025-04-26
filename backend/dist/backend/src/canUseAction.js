"use strict";
// backend/src/canUseAction.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementActionsUsed = exports.canUseAction = void 0;
function canUseAction(gameState) {
    return (gameState.actionsUsed ?? 0) < 2;
}
exports.canUseAction = canUseAction;
function incrementActionsUsed(gameState) {
    return {
        ...gameState,
        actionsUsed: (gameState.actionsUsed ?? 0) + 1
    };
}
exports.incrementActionsUsed = incrementActionsUsed;
