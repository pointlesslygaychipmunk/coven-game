"use strict";
// backend/src/modules/questSystem.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveQuests = void 0;
/**
 * Resolve ritual quests:
 *  1. When total contributions ≥ goal, mark fulfilled.
 *  2. Distribute numeric rewards (gold, renown, craftPoints) in proportion to each player's contribution.
 *  3. Grant any uniqueItem to every contributor.
 *  4. Log a global journal entry.
 */
function resolveQuests(quests, state) {
    return quests.map(q => {
        if (!q.fulfilled) {
            const total = Object.values(q.contributions).reduce((sum, v) => sum + v, 0);
            if (total >= q.goal) {
                q.fulfilled = true;
                // Distribute rewards
                Object.entries(q.contributions).forEach(([pid, contrib]) => {
                    const player = state.players.find(p => p.id === pid);
                    if (!player)
                        return;
                    const share = contrib / total;
                    if (q.reward.gold) {
                        player.gold += Math.floor(q.reward.gold * share);
                    }
                    if (q.reward.renown) {
                        player.renown += Math.floor(q.reward.renown * share);
                    }
                    if (q.reward.craftPoints) {
                        player.craftPoints += Math.floor(q.reward.craftPoints * share);
                    }
                    if (q.reward.uniqueItem) {
                        player.journal = player.journal || [];
                        player.journal.push(`You received the unique item “${q.reward.uniqueItem}” for completing “${q.title}.”`);
                    }
                });
                // Global log
                state.journal.push(`Ritual quest "${q.title}" has been completed!`);
            }
        }
        return q;
    });
}
exports.resolveQuests = resolveQuests;
