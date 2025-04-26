"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgrade = void 0;
function upgrade(player, type) {
    const currentLevel = player.upgrades[type];
    const maxLevel = 3;
    if (currentLevel >= maxLevel)
        throw new Error('Already at max level');
    const costGold = (currentLevel + 1) * 4;
    const costCraft = (currentLevel + 1) * 2;
    if (player.gold < costGold || player.craftPoints < costCraft) {
        throw new Error('Not enough resources');
    }
    player.gold -= costGold;
    player.craftPoints -= costCraft;
    player.upgrades[type] += 1;
}
exports.upgrade = upgrade;
