import { v4 as uuidv4 } from 'uuid';
import type {
  GameState,
  Player,
  GardenSlot,
  InventoryItem,
  MarketItem,
  TownRequest,
  Rumor,
  RitualQuest,
  GameAction
} from '@shared/types';

// Constants
const CROPS = ['Lavender', 'Rosemary', 'Nightshade', 'Mandrake'] as const;
const POTIONS = ['Healing Salve', 'Moonwell Elixir', 'Radiant Balm'] as const;
const BASE_PRICES: Record<string, number> = {
  'Lavender Seeds': 5,
  'Rosemary Seeds': 5,
  'Nightshade Seeds': 8,
  'Mandrake Seeds': 10,
  'Lavender': 15,
  'Rosemary': 15,
  'Nightshade': 25,
  'Mandrake': 30,
  'Healing Salve': 50,
  'Moonwell Elixir': 80,
  'Radiant Balm': 100
};
const GROWTH_REQUIREMENTS: Record<string, number> = {
  'Lavender': 3,
  'Rosemary': 3,
  'Nightshade': 4,
  'Mandrake': 5
};
const TOWN_NAMES = ['Ashwick', 'Brambleton', 'Cindervale'];

const POTION_RECIPES = [
  { ingredients: ['Lavender', 'Rosemary'], result: 'Healing Salve' },
  { ingredients: ['Mandrake', 'Nightshade'], result: 'Moonwell Elixir' },
  { ingredients: ['Lavender', 'Mandrake'], result: 'Radiant Balm' }
];

// Helpers
function createEmptyGarden(size: number): GardenSlot[] {
  const garden: GardenSlot[] = [];
  for (let i = 0; i < size; i++) {
    garden.push({ id: i, plant: null });
  }
  return garden;
}

// Game creation
export function createInitialGameState(): GameState {
  const players: Player[] = [
    {
      id: uuidv4(),
      name: 'Willow',
      gold: 100,
      garden: createEmptyGarden(6),
      inventory: [],
      influence: {},
      ascendancy: false,
      actionsUsed: 0
    },
    {
      id: uuidv4(),
      name: 'Rowan',
      gold: 100,
      garden: createEmptyGarden(6),
      inventory: [],
      influence: {},
      ascendancy: false,
      actionsUsed: 0
    }
  ];

  for (const player of players) {
    TOWN_NAMES.forEach(town => (player.influence[town] = 0));
    for (const crop of CROPS) {
      player.inventory.push({ name: `${crop} Seeds`, category: 'seed', quantity: 2 });
    }
  }

  const market: MarketItem[] = [];
  for (const [item, price] of Object.entries(BASE_PRICES)) {
    market.push({
      name: item,
      category: item.endsWith('Seeds') ? 'seed' : item.includes('Potion') ? 'potion' : 'herb',
      basePrice: price,
      price,
      demandMemory: 0,
      available: undefined
    });
  }

  const ritual: RitualQuest = {
    name: 'Moonwell Ascension',
    steps: [
      { description: 'Offer 3 Lavender', requirement: { item: 'Lavender', quantity: 3 }, done: false },
      { description: 'Brew a Moonwell Elixir', requirement: { item: 'Moonwell Elixir', quantity: 1 }, done: false }
    ],
    currentStep: 0,
    active: true
  };

  return {
    players,
    market,
    townRequests: [],
    rumors: [],
    ritual,
    log: ['The Coven awakens under the New Moon...'],
    status: {
      turn: 1,
      moonPhase: 0,
      season: 'Spring',
      weather: 'clear',
      currentPlayer: players[0].id,
      status: 'ongoing'
    }
  };
}

// Main action application
export function applyGameAction(state: GameState, action: GameAction): { success: boolean; state?: GameState; error?: string } {
  const player = state.players.find(p => p.id === action.playerId);
  if (!player) return { success: false, error: 'Invalid player.' };

  const mainActionTypes: GameAction['type'][] = ['plant', 'water', 'harvest', 'buy', 'sell', 'fulfillRequest', 'performRitual'];
  if (mainActionTypes.includes(action.type)) {
    if (player.actionsUsed >= 2) {
      return { success: false, error: 'No actions remaining this turn.' };
    }
    player.actionsUsed += 1;
  }

  switch (action.type) {
    case 'plant':
      return handlePlant(state, player, action.seedName, action.slotId);
    case 'water':
      return handleWater(state, player, action.slotId);
    case 'harvest':
      return handleHarvest(state, player, action.slotId);
    case 'brew':
      return handleBrew(state, player, action.ingredients);
    case 'buy':
      return handleBuy(state, player, action.itemName);
    case 'sell':
      return handleSell(state, player, action.itemName);
    case 'startRumor':
      return handleRumor(state, player, action.content);
    case 'fulfillRequest':
      return handleFulfill(state, player, action.requestId);
    case 'performRitual':
      return handleRitual(state, player);
    case 'endTurn':
      return { success: true, state: advanceTurn(state) };
    default:
      return { success: false, error: 'Unknown action.' };
  }
}

// (helpers: handlePlant, handleWater, handleHarvest, etc.)

function handlePlant(state: GameState, player: Player, seedName: string, slotId: number) {
    const invItem = player.inventory.find(it => it.name === seedName && it.quantity > 0);
    const slot = player.garden.find(s => s.id === slotId);
  
    if (!invItem) return { success: false, error: 'No seeds available.' };
    if (!slot || slot.plant !== null) return { success: false, error: 'Invalid or occupied slot.' };
  
    invItem.quantity--;
    if (invItem.quantity === 0) player.inventory = player.inventory.filter(it => it !== invItem);
  
    const herb = seedName.replace(' Seeds', '');
    slot.plant = {
      name: herb,
      growth: 0,
      growthRequired: GROWTH_REQUIREMENTS[herb] || 3,
      watered: false
    };
  
    state.log.push(`${player.name} plants ${herb} in their garden.`);
    return { success: true, state };
  }
  
  function handleWater(state: GameState, player: Player, slotId: number) {
    const slot = player.garden.find(s => s.id === slotId);
    if (!slot || !slot.plant) return { success: false, error: 'Nothing to water.' };
    if (slot.plant.watered) return { success: false, error: 'Already watered this turn.' };
  
    slot.plant.watered = true;
    state.log.push(`${player.name} waters their ${slot.plant.name}.`);
    return { success: true, state };
  }
  
  function handleHarvest(state: GameState, player: Player, slotId: number) {
    const slot = player.garden.find(s => s.id === slotId);
    if (!slot || !slot.plant) return { success: false, error: 'Nothing to harvest.' };
    if (slot.plant.growth < slot.plant.growthRequired) return { success: false, error: 'Not fully grown yet.' };
  
    const herb = slot.plant.name;
    addItem(player, herb, 'herb', 1);
  
    slot.plant = null;
    state.log.push(`${player.name} harvests a mature ${herb}.`);
    return { success: true, state };
  }
  
  function handleBrew(state: GameState, player: Player, ingredients: string[]) {
    const needed = [...ingredients];
    for (const ing of needed) {
      const inv = player.inventory.find(it => it.name === ing && it.quantity > 0);
      if (!inv) return { success: false, error: 'Missing ingredients.' };
    }
  
    needed.forEach(ing => {
      const inv = player.inventory.find(it => it.name === ing);
      if (inv) {
        inv.quantity--;
        if (inv.quantity === 0) player.inventory = player.inventory.filter(i => i !== inv);
      }
    });
  
    const match = POTION_RECIPES.find(r => {
      const ingList = [...r.ingredients].sort();
      const givenList = [...ingredients].sort();
      return ingList[0] === givenList[0] && ingList[1] === givenList[1];
    });
  
    if (!match) {
      state.log.push(`${player.name} brews... something. It fizzles.`);
      return { success: true, state };
    }
  
    addItem(player, match.result, 'potion', 1);
    state.log.push(`${player.name} brews a ${match.result}.`);
    return { success: true, state };
  }
  
  function handleBuy(state: GameState, player: Player, itemName: string) {
    const marketItem = state.market.find(m => m.name === itemName);
    if (!marketItem) return { success: false, error: 'Item not in market.' };
    if (player.gold < marketItem.price) return { success: false, error: 'Not enough gold.' };
  
    player.gold -= marketItem.price;
    addItem(player, itemName, marketItem.category, 1);
  
    marketItem.demandMemory++;
    state.log.push(`${player.name} buys ${itemName} for ${marketItem.price}g.`);
    return { success: true, state };
  }
  
  function handleSell(state: GameState, player: Player, itemName: string) {
    const invItem = player.inventory.find(it => it.name === itemName && it.quantity > 0);
    if (!invItem) return { success: false, error: 'Item not in inventory.' };
  
    const marketItem = state.market.find(m => m.name === itemName)
      || {
        name: itemName,
        category: invItem.category,
        basePrice: 10,
        price: 10,
        demandMemory: 0
      };
    if (!state.market.includes(marketItem)) {
      state.market.push(marketItem);
    }
  
    player.gold += marketItem.price;
    invItem.quantity--;
    if (invItem.quantity === 0) player.inventory = player.inventory.filter(it => it !== invItem);
  
    marketItem.demandMemory--;
    state.log.push(`${player.name} sells ${itemName} for ${marketItem.price}g.`);
    return { success: true, state };
  }
  
  function handleRumor(state: GameState, player: Player, content: string) {
    const rumor: Rumor = {
      id: uuidv4(),
      content,
      spread: 1
    };
    state.rumors.push(rumor);
    state.log.push(`${player.name} spreads a rumor: "${content}"`);
    return { success: true, state };
  }
  
  function handleFulfill(state: GameState, player: Player, requestId: string) {
    const req = state.townRequests.find(r => r.id === requestId);
    if (!req || req.fulfilled) return { success: false, error: 'Request not found.' };
  
    const inv = player.inventory.find(it => it.name === req.item && it.quantity >= req.quantity);
    if (!inv) return { success: false, error: 'Not enough items.' };
  
    inv.quantity -= req.quantity;
    if (inv.quantity === 0) player.inventory = player.inventory.filter(it => it !== inv);
  
    player.gold += req.rewardGold;
    player.influence[req.town] = (player.influence[req.town] || 0) + req.rewardInfluence;
    req.fulfilled = true;
  
    state.log.push(`${player.name} fulfills ${req.town}'s request.`);
    return { success: true, state };
  }
  
  function handleRitual(state: GameState, player: Player) {
    const ritual = state.ritual;
    if (!ritual.active) return { success: false, error: 'No active ritual.' };
  
    const step = ritual.steps[ritual.currentStep];
    const inv = player.inventory.find(it => it.name === step.requirement.item && it.quantity >= step.requirement.quantity);
    if (!inv) return { success: false, error: 'Missing ritual requirement.' };
  
    inv.quantity -= step.requirement.quantity;
    if (inv.quantity === 0) player.inventory = player.inventory.filter(it => it !== inv);
  
    step.done = true;
    ritual.currentStep++;
    state.log.push(`${player.name} completes a ritual step.`);
  
    if (ritual.currentStep >= ritual.steps.length) {
      ritual.active = false;
      player.ascendancy = true;
      state.status.status = 'completed';
      state.status.winner = player.id;
      state.log.push(`✨ ${player.name} has achieved Hexcraft Ascendancy!`);
    }
  
    return { success: true, state };
  }
  
  function addItem(player: Player, itemName: string, category: 'seed' | 'herb' | 'potion', quantity: number) {
    const existing = player.inventory.find(it => it.name === itemName);
    if (existing) {
      existing.quantity += quantity;
    } else {
      player.inventory.push({ name: itemName, category, quantity });
    }
  }
  
  function advanceTurn(state: GameState): GameState {
    const s = state.status;
    const pIndex = state.players.findIndex(p => p.id === s.currentPlayer);
    const nextIndex = (pIndex + 1) % state.players.length;
  
    s.turn++;
    s.moonPhase = (s.moonPhase + 1) % 8;
    s.currentPlayer = state.players[nextIndex].id;
  
    // Reset actions
    for (const player of state.players) {
      player.actionsUsed = 0;
    }
  
    if (s.turn % 24 === 1) {
      s.season = nextSeason(s.season);
      state.log.push(`🌸 Season changes to ${s.season}.`);
    }
  
    s.weather = generateWeather(s.season);
    state.log.push(`Weather: ${s.weather}.`);
  
    return state;
  }
  
  function nextSeason(current: 'Spring' | 'Summer' | 'Autumn' | 'Winter'): 'Spring' | 'Summer' | 'Autumn' | 'Winter' {
    if (current === 'Spring') return 'Summer';
    if (current === 'Summer') return 'Autumn';
    if (current === 'Autumn') return 'Winter';
    return 'Spring';
  }
  
  function generateWeather(season: 'Spring' | 'Summer' | 'Autumn' | 'Winter'): 'clear' | 'rainy' | 'stormy' | 'misty' | 'snowy' {
    const r = Math.random();
    if (season === 'Winter') {
      return r < 0.4 ? 'snowy' : r < 0.7 ? 'misty' : 'clear';
    }
    if (season === 'Spring') {
      return r < 0.5 ? 'rainy' : 'clear';
    }
    if (season === 'Summer') {
      return r < 0.3 ? 'stormy' : 'clear';
    }
    return r < 0.4 ? 'rainy' : 'clear';
  }
  