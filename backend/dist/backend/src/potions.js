"use strict";
// backend/src/potions.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPotions = exports.getPotionByName = exports.potionLibrary = void 0;
exports.potionLibrary = [
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
        tier: 'epic',
        ingredients: {
            herb: 2,
            flower: 1,
            mushroom: 2,
            fruit: 0
        }
    }
];
function getPotionByName(name) {
    return exports.potionLibrary.find(p => p.name === name);
}
exports.getPotionByName = getPotionByName;
function getAllPotions() {
    return exports.potionLibrary;
}
exports.getAllPotions = getAllPotions;
