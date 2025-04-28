// backend/src/modules/familiarPowers.ts

import { Player, FamiliarPower, GameState } from '../../.././shared/types'

/**
 * A catalog of all possible familiar powers.
 * You can extend this list with more tiers and effects.
 */
const POWER_LIBRARY: Omit<FamiliarPower, 'id'>[] = [
  {
    name: 'Lunar Edge',
    description: 'Gain +1 craft point on a full moon.',
    effect: { type: 'craft', value: 1 },
    tier: 1,
  },
  {
    name: 'Market Insight',
    description: 'When a market price spikes, gain +1 gold.',
    effect: { type: 'gainGoldOnSpike', value: 1 },
    tier: 1,
  },
  {
    name: 'Fertile Soil',
    description: 'Watering uses one less action per turn.',
    effect: { type: 'waterDiscount', value: 1 },
    tier: 1,
  },
  {
    name: 'Ritual Membrane',
    description: 'Each time you fulfill a quest, gain +1 renown.',
    effect: { type: 'gainRenownOnQuest', value: 1 },
    tier: 1,
  },
]

/**
 * Returns a small random selection of starting powers.
 */
export function getStartingFamiliarPowers(): FamiliarPower[] {
  // Shuffle and take 2
  const shuffled = [...POWER_LIBRARY].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 2).map((p, i) => ({
    id: `familiar_${Date.now()}_${i}`,
    ...p,
  }))
}

/**
 * Applies a single familiar power effect for this turn.
 */
function applyPower(player: Player, state: GameState, power: FamiliarPower): void {
  switch (power.effect.type) {
    case 'craft':
      // full moon = phase 4
      if (state.status.moonPhase === 4) {
        player.craftPoints += power.effect.value
      }
      break

    case 'gainGoldOnSpike':
      // if any rumor of that player about a market spike just fired
      state.rumors
        .filter(r => r.source === 'market' && r.message.includes(player.id))
        .forEach(_ => {
          player.gold += power.effect.value
        })
      break

    case 'waterDiscount':
      // reduce wateringUsed so they get one extra water
      player.wateringUsed = Math.max(0, player.wateringUsed - power.effect.value)
      break

    case 'gainRenownOnQuest':
      // count newly fulfilled quests this turn
      // (we assume resolveQuests has marked them and added to journal)
      const newQuestRumors = state.rumors.filter(
        r => r.source === 'quest' && r.id.includes(player.id)
      )
      if (newQuestRumors.length) {
        player.renown += power.effect.value * newQuestRumors.length
      }
      break

    default:
      // no-op for unknown
      break
  }
}

/**
 * Walks through a player's familiar powers and applies their effects.
 * Call this once per player per turn in your turnEngine.
 */
export function applyFamiliarPowers(player: Player, state: GameState): void {
  for (const power of player.familiarPowers || []) {
    applyPower(player, state, power)
  }
}