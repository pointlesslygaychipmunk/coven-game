// backend/src/modules/rumorEngine.ts

import { GameState, Rumor } from '../../.././shared/types';

/** A small helper to pick a random element */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Phrase fragments for market‐spike rumors
const spikeIntros = [
  "Whispers say",
  "Rumor has it",
  "Word on the street is",
  "They’re talking that",
  "I heard",
];

const spikeVerbs = [
  "soared",
  "skyrocketed",
  "shot up",
  "exploded",
  "ballooned",
];

const spikeConclusions = [
  "– watch your purse!",
  "– time to invest?",
  "– luck’s favor?",
  "– chaos incoming!",
  "– what’s next?",
];

// Phrase fragments for quest‐fulfillment rumors
const questIntros = [
  "They say",
  "I’ve heard",
  "Some claim",
  "It’s told",
  "Legend goes",
];

export function generateRumors(state: GameState): Rumor[] {
  const rumors: Rumor[] = [];
  const now = Date.now();

  // 1) Market spikes
  Object.entries(state.market.items).forEach(([itemId, item]) => {
    if (
      'basePrice' in item &&
      typeof item.basePrice === 'number' &&
      typeof item.currentPrice === 'number'
    ) {
      const threshold = item.basePrice * 1.5;
      if (item.currentPrice > threshold) {
        const id = `market_spike_${itemId}`;
        if (!state.rumors.find(r => r.id === id)) {
          // Build a randomized message
          const intro = pick(spikeIntros);
          const verb = pick(spikeVerbs);
          const ending = pick(spikeConclusions);
          const msg = `${intro} ${itemId} ${verb} to ${item.currentPrice}${ending}`;

          rumors.push({ id, message: msg, source: 'market', timestamp: now });
        }
      }
    }
  });

  // 2) Quest fulfillments
  state.quests.forEach(quest => {
    if (quest.fulfilled) {
      const id = `quest_fulfilled_${quest.id}`;
      if (!state.rumors.find(r => r.id === id)) {
        const intro = pick(questIntros);
        // e.g. “They say the Ritual of Thorns is complete.”
        const msg = `${intro} the ritual “${quest.title}” is now complete.`;
        rumors.push({ id, message: msg, source: 'quest', timestamp: now });
      }
    }
  });

  return rumors;
}