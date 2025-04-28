// backend/src/potions.ts

import type { Potion } from './shared/types';

export const potionLibrary: Potion[] = [
  {
    id: 'p1',
    name: 'Soothing Elixir',
    tier: 'common',
    ingredients: {
      herb: 2,
      flower: 1,
      mushroom: 0,
      fruit: 0
    }
  },
  {
    id: 'p2',
    name: 'Moonlight Tonic',
    tier: 'common',
    ingredients: {
      herb: 0,
      flower: 2,
      mushroom: 0,
      fruit: 1
    }
  },
  {
    id: 'p3',
    name: 'Fungal Philter',
    tier: 'rare',
    ingredients: {
      herb: 0,
      flower: 0,
      mushroom: 3,
      fruit: 0
    }
  },
  {
    id: 'p4',
    name: 'Verdant Draught',
    tier: 'rare',
    ingredients: {
      herb: 1,
      flower: 0,
      mushroom: 0,
      fruit: 2
    }
  },
  {
    id: 'p5',
    name: 'Elixir of Echoes',
    tier: 'legendary',
    ingredients: {
      herb: 2,
      flower: 1,
      mushroom: 2,
      fruit: 0
    }
  }
];

export function getPotionByName(name: string): Potion | undefined {
  return potionLibrary.find(p => p.name === name);
}

export function getAllPotions(): Potion[] {
  return potionLibrary;
}