// backend/src/modules/blackMarket.ts

import { GameState, Rumor, MarketMemoryEntry } from '../../../shared/types';

/**
 * Process black market mechanics:
 * - For each player, look at their market memory entries.
 * - If an entry corresponds to a black-market item, generate a rumor.
 * - If the player’s renown is below the item’s riskLevel, apply a penalty.
 * - Once processed, remove those memory entries so rumors only fire once.
 */
export function processBlackMarket(state: GameState): Partial<GameState> {
  const now = Date.now();

  state.players.forEach(player => {
    // Explicitly typed array of memory entries to keep
    const remainingMemory: MarketMemoryEntry[] = [];

    (player.memory || []).forEach(entry => {
      const item = state.market.items[entry.itemId];
      // Only black-market items have a riskLevel property
      if (item && 'riskLevel' in item) {
        const rumorId = `bm_${player.id}_${entry.itemId}`;

        if (!state.rumors.some(r => r.id === rumorId)) {
          const price = entry.price;
          const msg = `Shadows whisper that ${player.name} procured forbidden ${entry.itemId} for ${price} gold.`;

          // Add rumor and journal entry
          state.rumors.push({ id: rumorId, message: msg, source: 'blackMarket', timestamp: now });
          state.journal.push(msg);

          // Apply penalty if renown is too low
          const riskLevel = (item as any).riskLevel as number;
          if (player.renown < riskLevel) {
            player.renown = Math.max(0, player.renown - 1);
            const penMsg = `${player.name} is shamed and loses 1 renown for risky dealings.`;
            state.journal.push(penMsg);
          }
        }
      } else {
        // Keep non–black-market entries for next turn
        remainingMemory.push(entry);
      }
    });

    // Update player's memory, dropping processed entries
    player.memory = remainingMemory;
  });

  return {};
}