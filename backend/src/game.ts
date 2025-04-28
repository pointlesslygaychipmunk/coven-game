import { v4 as uuidv4 } from 'uuid';
import type { GameState, Player, GardenSlot, InventoryItem, MarketItem, TownRequest, Rumor, RitualQuest, GameAction } from '../../shared/src/types';

// Game constants and initial data definitions
const PLANT_GROWTH_TIMES: Record<string, number> = {
  'Lavender': 3,
  'Rosemary': 3,
  'Nightshade': 4,
  'Mandrake': 5
};
const BASE_PRICES: Record<string, number> = {
  'Lavender Seeds': 5,
  'Rosemary Seeds': 5,
  'Nightshade Seeds': 8,
  'Mandrake Seeds': 10,
  'Lavender': 15,
  'Rosemary': 15,
  'Nightshade': 25,
  'Mandrake': 30,
  'Healing Potion': 50,
  'Invisibility Potion': 80,
  'Love Potion': 60
};
const TOWN_NAMES: string[] = ['Ashwick', 'Brambleton', 'Cindervale'];

// Define potion recipes (two ingredients -> potion)
const RECIPES: Array<{ ingredients: [string, string], result: string }> = [
  { ingredients: ['Lavender', 'Rosemary'], result: 'Healing Potion' },
  { ingredients: ['Mandrake', 'Nightshade'], result: 'Invisibility Potion' },
  { ingredients: ['Lavender', 'Nightshade'], result: 'Love Potion' }
];

/** Create initial game state with some default players and starting setup. */
export function createInitialGameState(): GameState {
  // Create players
  const players: Player[] = [
    {
      id: uuidv4(),
      name: 'Alice',
      gold: 100,
      garden: createEmptyGarden(8),
      inventory: [],
      influence: {},
      ascendancy: false,
      actionsUsed: 0
    },
    {
      id: uuidv4(),
      name: 'Bob',
      gold: 100,
      garden: createEmptyGarden(8),
      inventory: [],
      influence: {},
      ascendancy: false,
      actionsUsed: 0
    }
  ];
  // Initialize influence for each town to 0 for each player
  for (const player of players) {
    TOWN_NAMES.forEach(town => player.influence[town] = 0);
  }
  // Give initial seeds to players
  const initialSeeds = ['Lavender Seeds', 'Rosemary Seeds', 'Nightshade Seeds', 'Mandrake Seeds'];
  for (const player of players) {
    for (const seed of initialSeeds) {
      player.inventory.push({ name: seed, category: 'seed', quantity: 2 });
    }
  }
  // Set up market items (seeds, herbs, potions)
  const market: MarketItem[] = [];
  for (const item of Object.keys(BASE_PRICES)) {
    const category = item.endsWith('Seeds') ? 'seed'
                  : (item.includes('Potion') ? 'potion' : 'herb');
    const isBlack = false;
    market.push({
      name: item,
      category,
      basePrice: BASE_PRICES[item],
      price: BASE_PRICES[item],
      demandMemory: 0,
      available: category === 'potion' ? 0 : undefined,
      blackMarket: isBlack
    });
  }
  // Initial town requests
  const townRequests: TownRequest[] = [
    {
      id: uuidv4(),
      town: 'Ashwick',
      item: 'Healing Potion',
      quantity: 2,
      rewardGold: 50,
      rewardInfluence: 5,
      fulfilled: false
    },
    {
      id: uuidv4(),
      town: 'Brambleton',
      item: 'Lavender',
      quantity: 3,
      rewardGold: 30,
      rewardInfluence: 3,
      fulfilled: false
    },
    {
      id: uuidv4(),
      town: 'Cindervale',
      item: 'Invisibility Potion',
      quantity: 1,
      rewardGold: 80,
      rewardInfluence: 8,
      fulfilled: false
    }
  ];
  // Initial rumors
  const rumors: Rumor[] = [
    { id: uuidv4(), content: 'Whispers say the next full moon will bring unusual tides.', spread: 1, impact: '' },
    { id: uuidv4(), content: 'Lights in the forest of Ashwick have townsfolk uneasy.', spread: 2, impact: '' }
  ];
  // Ritual quest definition
  const ritual: RitualQuest = {
    name: 'Moonlit Ritual',
    steps: [
      { description: 'Offer 3 Lavender sprigs', requirement: { item: 'Lavender', quantity: 3 }, done: false },
      { description: 'Brew and offer a Healing Potion', requirement: { item: 'Healing Potion', quantity: 1 }, done: false },
      { description: 'Offer 1 Nightshade', requirement: { item: 'Nightshade', quantity: 1 }, done: false }
    ],
    currentStep: 0,
    active: true,
    completedBy: undefined
  };
  // Initial game status
  const status = {
    turn: 1,
    moonPhase: 0, // 0 = New Moon (will increment as turns progress)
    season: 'Spring' as const,
    weather: 'clear' as const,
    currentPlayer: players[0].id,
    status: 'ongoing' as const,
    winner: undefined
  };
  // Determine initial weather for turn 1
  status.weather = generateWeather(status.season);
  const log: string[] = [];
  log.push(`Game start: Season ${status.season}, Weather is ${status.weather}. It is ${players[0].name}'s turn.`);
  return { players, market, townRequests, rumors, ritual, log, status };
}

/** Create an empty garden with given number of slots. */
function createEmptyGarden(size: number): GardenSlot[] {
  const garden: GardenSlot[] = [];
  for (let i = 0; i < size; i++) {
    garden.push({ id: i, plant: null });
  }
  return garden;
}

/** Apply a player action to the game state. Returns updated state or error. */
export function applyGameAction(state: GameState, action: GameAction): { success: boolean, state?: GameState, error?: string } {
  const player = state.players.find(p => p.id === action.playerId);
  if (!player) {
    return { success: false, error: 'Player not found' };
  }
  // If action counts toward limit, ensure not exceeded
  const mainActionTypes: GameAction['type'][] = ['plant', 'water', 'harvest', 'buy', 'sell', 'fulfillRequest', 'performRitual'];
  if (mainActionTypes.includes(action.type)) {
    if (player.actionsUsed >= 2) {
      return { success: false, error: 'No actions remaining this turn' };
    }
    player.actionsUsed += 1;
  }
  switch(action.type) {
    case 'plant': {
      const { seedName, slotId } = action;
      const invItem = player.inventory.find(it => it.name === seedName && it.quantity > 0);
      if (!invItem) {
        return { success: false, error: 'Seed not available in inventory' };
      }
      const slot = player.garden.find(s => s.id === slotId);
      if (!slot) {
        return { success: false, error: 'Invalid garden slot' };
      }
      if (slot.plant !== null) {
        return { success: false, error: 'Garden slot is not empty' };
      }
      // Deduct one seed from inventory
      invItem.quantity -= 1;
      if (invItem.quantity === 0) {
        player.inventory = player.inventory.filter(it => it !== invItem);
      }
      // Plant the seed: determine herb name and growth requirement
      const herbName = seedName.replace(' Seeds', '');
      const growthReq = PLANT_GROWTH_TIMES[herbName] || 3;
      slot.plant = { name: herbName, growth: 0, growthRequired: growthReq, watered: false };
      state.log.push(`${player.name} plants ${herbName} in their garden.`);
      break;
    }
    case 'water': {
      const { slotId } = action;
      const slot = player.garden.find(s => s.id === slotId);
      if (!slot || !slot.plant) {
        return { success: false, error: 'Nothing to water' };
      }
      if (slot.plant.watered) {
        return { success: false, error: 'Already watered this turn' };
      }
      slot.plant.watered = true;
      state.log.push(`${player.name} waters the ${slot.plant.name} in slot ${slotId}.`);
      break;
    }
    case 'harvest': {
      const { slotId } = action;
      const slot = player.garden.find(s => s.id === slotId);
      if (!slot || !slot.plant) {
        return { success: false, error: 'Nothing to harvest' };
      }
      if (slot.plant.growth < slot.plant.growthRequired) {
        return { success: false, error: 'Plant is not fully grown yet' };
      }
      const herbName = slot.plant.name;
      // Add harvested herb to inventory
      let herbItem = player.inventory.find(it => it.name === herbName);
      if (herbItem) {
        herbItem.quantity += 1;
      } else {
        player.inventory.push({ name: herbName, category: 'herb', quantity: 1 });
      }
      // Clear the garden slot
      slot.plant = null;
      state.log.push(`${player.name} harvests ${herbName} from their garden.`);
      break;
    }
    case 'brew': {
      const { ingredients } = action;
      // Ensure player has all ingredients required
      const invCounts: Record<string, number> = {};
      for (const ing of ingredients) {
        invCounts[ing] = (invCounts[ing] || 0) + 1;
      }
      for (const ing of Object.keys(invCounts)) {
        const have = player.inventory.find(it => it.name === ing && it.quantity >= invCounts[ing]);
        if (!have) {
          return { success: false, error: 'Missing ingredients for brew' };
        }
      }
      // Check if ingredients match a known recipe
      const sortedIngs = [...ingredients].sort();
      const recipe = RECIPES.find(r => {
        const ingList = [...r.ingredients].sort();
        return ingList[0] === sortedIngs[0] && ingList[1] === sortedIngs[1];
      });
      if (!recipe) {
        state.log.push(`${player.name}'s brewing attempt failed (unknown recipe).`);
        // Consume ingredients even for failed attempt (representing waste)
        for (const ing of Object.keys(invCounts)) {
          const invItem = player.inventory.find(it => it.name === ing);
          if (invItem) {
            invItem.quantity -= invCounts[ing];
            if (invItem.quantity <= 0) {
              player.inventory = player.inventory.filter(it => it !== invItem);
            }
          }
        }
        return { success: true, state };
      }
      const potionName = recipe.result;
      // Remove ingredients from inventory for successful brew
      for (const ing of Object.keys(invCounts)) {
        const invItem = player.inventory.find(it => it.name === ing);
        if (invItem) {
          invItem.quantity -= invCounts[ing];
          if (invItem.quantity <= 0) {
            player.inventory = player.inventory.filter(it => it !== invItem);
          }
        }
      }
      // Brew the potion: if potion already in inventory, upgrade its tier
      let potionItem = player.inventory.find(it => it.name === potionName);
      if (potionItem) {
        potionItem.tier = potionItem.tier ? potionItem.tier + 1 : 2;
      } else {
        potionItem = { name: potionName, category: 'potion', quantity: 1, tier: 1 };
        player.inventory.push(potionItem);
      }
      state.log.push(`${player.name} brews a ${potionName}${potionItem.tier && potionItem.tier > 1 ? ' (Tier ' + potionItem.tier + ')' : ''}.`);
      break;
    }
    case 'buy': {
      const { itemName } = action;
      const marketItem = state.market.find(m => m.name === itemName);
      if (!marketItem) {
        return { success: false, error: 'Item not found on market' };
      }
      if (marketItem.available !== undefined) {
        // If stock is tracked and none available
        if (marketItem.available <= 0) {
          return { success: false, error: 'Item is out of stock' };
        }
      }
      if (player.gold < marketItem.price) {
        return { success: false, error: 'Not enough gold' };
      }
      player.gold -= marketItem.price;
      // Add item to player inventory
      let invItem = player.inventory.find(it => it.name === itemName);
      if (invItem) {
        invItem.quantity += 1;
      } else {
        player.inventory.push({ name: itemName, category: marketItem.category, quantity: 1 });
      }
      // Adjust market memory to reflect increased demand
      marketItem.demandMemory += 1;
      if (marketItem.available !== undefined) {
        marketItem.available = (marketItem.available || 0) - 1;
      }
      state.log.push(`${player.name} buys ${itemName} for ${marketItem.price} gold.`);
      break;
    }
    case 'sell': {
      const { itemName } = action;
      const invItem = player.inventory.find(it => it.name === itemName);
      if (!invItem || invItem.quantity < 1) {
        return { success: false, error: 'Item not in inventory' };
      }
      // Determine or create market item entry
      let marketItem = state.market.find(m => m.name === itemName);
      if (!marketItem) {
        const basePrice = BASE_PRICES[itemName] || 10;
        marketItem = {
          name: itemName,
          category: invItem.category,
          basePrice,
          price: basePrice,
          demandMemory: 0,
          available: 0
        };
        state.market.push(marketItem);
      }
      // Remove one item from inventory
      invItem.quantity -= 1;
      if (invItem.quantity <= 0) {
        player.inventory = player.inventory.filter(it => it !== invItem);
      }
      // Give gold to player (using current price)
      player.gold += marketItem.price;
      // Adjust market memory for increased supply
      marketItem.demandMemory -= 1;
      if (marketItem.available !== undefined) {
        marketItem.available = (marketItem.available || 0) + 1;
      }
      state.log.push(`${player.name} sells ${itemName} for ${marketItem.price} gold.`);
      break;
    }
    case 'startRumor': {
      const { content } = action;
      const rumor: Rumor = { id: uuidv4(), content, spread: 0, impact: '' };
      state.rumors.push(rumor);
      state.log.push(`${player.name} starts a rumor: "${content}"`);
      break;
    }
    case 'fulfillRequest': {
      const { requestId } = action;
      const req = state.townRequests.find(r => r.id === requestId);
      if (!req || req.fulfilled) {
        return { success: false, error: 'Request not available' };
      }
      // Check inventory for required item and quantity
      const invItem = player.inventory.find(it => it.name === req.item);
      if (!invItem || invItem.quantity < req.quantity) {
        return { success: false, error: 'Not enough items to fulfill request' };
      }
      // Deduct required items from inventory
      invItem.quantity -= req.quantity;
      if (invItem.quantity <= 0) {
        player.inventory = player.inventory.filter(it => it !== invItem);
      }
      // Grant rewards
      player.gold += req.rewardGold;
      player.influence[req.town] = (player.influence[req.town] || 0) + req.rewardInfluence;
      req.fulfilled = true;
      state.log.push(`${player.name} fulfills a request for ${req.town} (delivered ${req.quantity} ${req.item}).`);
      break;
    }
    case 'performRitual': {
      const ritual = state.ritual;
      if (!ritual.active || ritual.completedBy) {
        return { success: false, error: 'No active ritual to perform' };
      }
      const stepIndex = ritual.currentStep;
      if (stepIndex >= ritual.steps.length) {
        return { success: false, error: 'Ritual already complete' };
      }
      const step = ritual.steps[stepIndex];
      // Check inventory for required item
      const invItem = player.inventory.find(it => it.name === step.requirement.item);
      if (!invItem || invItem.quantity < step.requirement.quantity) {
        return { success: false, error: 'Requirement not met for ritual step' };
      }
      // Deduct required items
      invItem.quantity -= step.requirement.quantity;
      if (invItem.quantity <= 0) {
        player.inventory = player.inventory.filter(it => it !== invItem);
      }
      step.done = true;
      ritual.currentStep += 1;
      if (ritual.currentStep >= ritual.steps.length) {
        // Ritual completed
        ritual.active = false;
        ritual.completedBy = player.id;
        player.ascendancy = true;
        state.status.status = 'completed';
        state.status.winner = player.id;
        state.log.push(`✨ ${player.name} has completed the ${ritual.name} and achieved Hexcraft Ascendancy!`);
      } else {
        state.log.push(`${player.name} completes a step of the ritual: "${step.description}".`);
      }
      break;
    }
    case 'endTurn': {
      advanceTurn(state);
      break;
    }
    default:
      return { success: false, error: 'Unknown action' };
  }
  return { success: true, state };
}

/** Advance the game by one turn (one moon phase). Updates world state and rotates player turn. */
function advanceTurn(state: GameState) {
  if (state.status.status !== 'ongoing') {
    return;
  }
  const status = state.status;
  const players = state.players;
  // Determine next player index
  const currentIndex = players.findIndex(p => p.id === status.currentPlayer);
  const nextIndex = (currentIndex + 1) % players.length;
  // Increment turn count and moon phase
  status.turn += 1;
  status.moonPhase = (status.moonPhase + 1) % 8;
  // Season change every 24 turns (3 full moon cycles)
  if (status.turn % 24 === 1) {
    if (status.season === 'Spring') status.season = 'Summer';
    else if (status.season === 'Summer') status.season = 'Autumn';
    else if (status.season === 'Autumn') status.season = 'Winter';
    else if (status.season === 'Winter') status.season = 'Spring';
    state.log.push(`🌦 Season changes to ${status.season}.`);
  }
  // Determine weather for new turn
  status.weather = generateWeather(status.season);
  state.log.push(`Weather this turn: ${status.weather}.`);
  // Apply garden growth for all players
  for (const player of players) {
    for (const slot of player.garden) {
      if (slot.plant) {
        const plant = slot.plant;
        // Base growth increment
        let growthInc = 1;
        // If watered by player or if it's raining, give extra growth
        if (plant.watered || status.weather === 'rainy') {
          growthInc += 1;
        }
        // If snowy weather, no growth this turn
        if (status.weather === 'snowy') {
          growthInc = 0;
        }
        plant.growth += growthInc;
        // Reset watered flag for next turn
        plant.watered = false;
        if (plant.growth >= plant.growthRequired) {
          plant.growth = plant.growthRequired; // mark as fully grown (ready to harvest)
        }
      }
    }
  }
  // Spread and evolve rumors
  for (const rumor of state.rumors) {
    rumor.spread += 1;
    if (!rumor.impact && rumor.spread >= 3) {
      // On reaching threshold spread, determine an impact if any
      for (const town of TOWN_NAMES) {
        if (rumor.content.includes(town)) {
          rumor.impact = `Citizens of ${town} are murmuring nervously.`;
          state.log.push(`Rumor impact: ${rumor.impact}`);
          break;
        }
      }
      for (const item of Object.keys(BASE_PRICES)) {
        const itemKey = item.replace(' Seeds','');
        if (!rumor.impact && rumor.content.includes(itemKey)) {
          const mItem = state.market.find(m => m.name === item || m.name === itemKey);
          if (mItem) {
            mItem.price = Math.round(mItem.price * 1.2); // surge price by 20%
          }
          rumor.impact = `Market hearsay influences ${itemKey} prices.`;
          state.log.push(`Rumor impact: ${rumor.impact}`);
          break;
        }
      }
      if (!rumor.impact) {
        rumor.impact = 'Strange rumors swirl with no clear effect yet.';
        state.log.push(`Rumor impact: ${rumor.impact}`);
      }
    }
  }
  // Update market prices towards equilibrium based on demandMemory
  for (const item of state.market) {
    if (item.demandMemory !== 0) {
      const factor = 1 + (0.1 * item.demandMemory);
      item.price = Math.max(1, Math.round(item.basePrice * factor));
    }
    if (item.demandMemory > 0) {
      item.demandMemory -= 1;
    } else if (item.demandMemory < 0) {
      item.demandMemory += 1;
    }
  }
  // Town requests: maintain up to 3 active requests by adding new ones if some fulfilled
  const activeRequests = state.townRequests.filter(r => !r.fulfilled);
  if (activeRequests.length < 3) {
    const newReq = generateTownRequest();
    state.townRequests.push(newReq);
    state.log.push(`New town request posted: ${newReq.town} needs ${newReq.quantity} ${newReq.item}.`);
  }
  // Rotate current player to the next
  status.currentPlayer = players[nextIndex].id;
  // Reset actionsUsed for the new current player
  players[nextIndex].actionsUsed = 0;
  // Black Market event on full moon cycle (moonPhase reset to 0)
  if (status.moonPhase === 0) {
    state.log.push('The Sabbat (black market) arrives with rare goods.');
    // (In future, could make special items available here)
  }
  // Log turn transition
  const currentPlayerName = players.find(p => p.id === status.currentPlayer)?.name;
  state.log.push(`Turn ${status.turn} begins. It is now ${currentPlayerName}'s turn.`);
}

/** Generate weather based on current season. */
function generateWeather(season: 'Spring' | 'Summer' | 'Autumn' | 'Winter'): 'clear' | 'rainy' | 'stormy' | 'misty' | 'snowy' {
  const rand = Math.random();
  switch(season) {
    case 'Winter':
      if (rand < 0.4) return 'snowy';
      if (rand < 0.5) return 'misty';
      if (rand < 0.7) return 'rainy';
      return 'clear';
    case 'Spring':
      if (rand < 0.3) return 'rainy';
      if (rand < 0.5) return 'misty';
      return 'clear';
    case 'Autumn':
      if (rand < 0.3) return 'rainy';
      if (rand < 0.5) return 'misty';
      return 'clear';
    case 'Summer':
      if (rand < 0.2) return 'stormy';
      if (rand < 0.4) return 'rainy';
      return 'clear';
  }
  return 'clear';
}

/** Generate a new random town request (for when one is fulfilled). */
function generateTownRequest(): TownRequest {
  const town = TOWN_NAMES[Math.floor(Math.random() * TOWN_NAMES.length)];
  const requestPotion = Math.random() < 0.5;
  let item: string;
  let quantity: number;
  if (requestPotion) {
    const potions = ['Healing Potion', 'Invisibility Potion', 'Love Potion'];
    item = potions[Math.floor(Math.random() * potions.length)];
    quantity = 1;
  } else {
    const herbs = ['Lavender', 'Rosemary', 'Nightshade', 'Mandrake'];
    item = herbs[Math.floor(Math.random() * herbs.length)];
    quantity = 2 + Math.floor(Math.random() * 3); // request 2-4 herbs
  }
  const rewardGold = (BASE_PRICES[item] || 10) * quantity + (requestPotion ? 20 : 0);
  const rewardInfluence = requestPotion ? 8 : 5;
  return {
    id: uuidv4(),
    town,
    item,
    quantity,
    rewardGold,
    rewardInfluence,
    fulfilled: false
  };
}
