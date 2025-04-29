// backend/src/rumorEngine.ts
// Generates rumors each turn and adds them to the game state.
// Rumors affect market prices, item availability, and player decisions.

import { GameState, Rumor, Season, MoonPhase } from "@shared/types";

// Counter for unique rumor IDs
let rumorCount = 0;

// Rumor templates for different types of effects
// {item} will be replaced with a random item name
const rumorTemplates = {
  // Price increase rumors
  shortage: [
    "Rumors whisper of a shortage of {item} next moon.",
    "Travelers speak of a {item} shortage affecting nearby towns.",
    "Local witches claim that {item} will become scarce soon.",
    "A merchant caravan was lost with its cargo of {item}, causing shortages."
  ],
  
  // Price decrease rumors
  surplus: [
    "Travelers speak of a surplus of {item} flooding the market.",
    "Farmers report an abundant {item} harvest this season.",
    "A large shipment of {item} has arrived from distant lands.",
    "The Witches' Guild is selling off their excess {item} supplies."
  ],
  
  // Quality-related rumors
  quality: [
    "Villagers talk about {item} being blessed under the full moon.",
    "An ancient almanac suggests {item} gathered this season is especially potent.",
    "The elder witch claims that {item} found during {season} holds special properties.",
    "Whispers claim that {item} affected by {weather} develops unique characteristics."
  ],
  
  // Special item rumors
  special: [
    "A hushed voice mentions a rare variant of {item} appearing during {moonPhase}.",
    "The wandering merchant hinted about special {item} becoming available soon.",
    "Ancient texts speak of {item} with unique properties appearing this {season}.",
    "Dreams and omens suggest seeking {item} when the moon is {moonPhase}."
  ]
};

// Randomly picks an item name from the market to plug into a rumor template
function pickRandomItemName(state: GameState): string {
  if (state.market.length === 0) return "unknown item";
  
  // Favor more interesting/valuable items for rumors
  const potentialItems = state.market.filter(item => 
    item.rarity !== 'common' || item.type === 'ingredient' || item.type === 'potion'
  );
  
  // If we filtered too much, fall back to all items
  const itemPool = potentialItems.length > 0 ? potentialItems : state.market;
  
  const idx = Math.floor(Math.random() * itemPool.length);
  return itemPool[idx].name;
}

// Generate a list of rumors for the current game turn
export function generateRumors(state: GameState): Rumor[] {
  const newRumors: Rumor[] = [];
  
  // For each new phase (turn), decide if we generate new rumors
  // 40% chance to generate a rumor each phase
  if (Math.random() < 0.4) {
    // Select a rumor type
    const rumorTypes = ['shortage', 'surplus', 'quality', 'special'];
    const rumorType = rumorTypes[Math.floor(Math.random() * rumorTypes.length)];
    
    // Get templates for selected type
    const templates = rumorTemplates[rumorType as keyof typeof rumorTemplates];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Select an item to rumor about
    const itemName = pickRandomItemName(state);
    
    // Replace placeholders in the template
    let content = template.replace('{item}', itemName);
    content = content.replace('{season}', state.time.season);
    content = content.replace('{moonPhase}', state.time.phaseName);
    content = content.replace('{weather}', state.time.weatherFate);
    
    // Determine price effect based on rumor type
    let priceEffect = 0;
    if (rumorType === 'shortage') {
      priceEffect = 0.2; // +20% price effect
    } else if (rumorType === 'surplus') {
      priceEffect = -0.15; // -15% price effect
    } else if (rumorType === 'quality') {
      priceEffect = 0.1; // +10% price effect
    } else if (rumorType === 'special') {
      priceEffect = 0.25; // +25% price effect
    }
    
    // Create the new rumor
    const newRumor: Rumor = {
      id: `rumor${++rumorCount}`,
      content: content,
      spread: 10, // initial spread level (10%)
      affectedItem: itemName,
      priceEffect: priceEffect,
      duration: 3 + Math.floor(Math.random() * 4), // 3-6 turns
      verified: Math.random() < 0.7, // 70% of rumors are true
      origin: generateRumorSource(),
      turnsActive: 0
    };
    
    newRumors.push(newRumor);
  }
  
  return newRumors;
}

// Generate a source for where the rumor came from
function generateRumorSource(): string {
  const sources = [
    "a traveling merchant",
    "the apothecary",
    "village gossip",
    "a customer",
    "the elder witch",
    "the town crier",
    "a farmer",
    "a wandering bard",
    "your familiar",
    "dream visions",
    "a letter from afar",
    "market whispers"
  ];
  
  return sources[Math.floor(Math.random() * sources.length)];
}

// Update and spread existing rumors
export function processRumorEffects(state: GameState): void {
  // Process each active rumor
  state.rumors.forEach(rumor => {
    // Increment active counter
    rumor.turnsActive++;
    
    // Decay duration
    if (rumor.duration > 0) {
      rumor.duration--;
    }
    
    // Spread or fade rumors
    if (rumor.duration > 0) {
      // Rumors spread over time up to a maximum
      rumor.spread = Math.min(100, rumor.spread + 15);
    } else {
      // Once duration is over, rumors fade quickly
      rumor.spread = Math.max(0, rumor.spread - 30);
    }
    
    // Apply special effects for verified rumors (could add more later)
    if (rumor.verified && rumor.spread > 50) {
      // For high-spread, verified rumors about shortages, potentially adjust supply
      if (rumor.priceEffect > 0 && rumor.affectedItem) {
        // Create artificial shortage in the market (if true)
        if (state.marketData.supply[rumor.affectedItem]) {
          state.marketData.supply[rumor.affectedItem] = Math.max(
            10, state.marketData.supply[rumor.affectedItem] - 10
          );
        }
      }
      
      // For surplus rumors, increase supply
      if (rumor.priceEffect < 0 && rumor.affectedItem) {
        if (state.marketData.supply[rumor.affectedItem]) {
          state.marketData.supply[rumor.affectedItem] = Math.min(
            100, state.marketData.supply[rumor.affectedItem] + 15
          );
        }
      }
    }
  });
  
  // Remove rumors that have faded away completely
  state.rumors = state.rumors.filter(rumor => rumor.spread > 0);
}

// Optional: Verify a rumor (e.g., when player witnesses evidence)
export function verifyRumor(state: GameState, rumorId: string): boolean {
  const rumor = state.rumors.find(r => r.id === rumorId);
  if (!rumor) return false;
  
  rumor.verified = true;
  
  // Verified rumors spread faster
  rumor.spread = Math.min(100, rumor.spread + 20);
  
  return true;
}

// Optional: Player can spread a rumor to increase its effect
export function spreadRumor(state: GameState, playerId: string, rumorId: string): boolean {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return false;
  
  const rumor = state.rumors.find(r => r.id === rumorId);
  if (!rumor) return false;
  
  // Player's trading skill affects how well they spread rumors
  const tradingBonus = player.skills.trading / 10; // 0.1 to 1.0 bonus
  
  // Increase spread significantly when player actively spreads it
  rumor.spread = Math.min(100, rumor.spread + 25 + Math.round(tradingBonus * 10));
  
  // Extend duration
  rumor.duration = Math.min(10, rumor.duration + 2);
  
  return true;
}

// Optional: Create a custom rumor (for player actions or quests)
export function createCustomRumor(
  state: GameState, 
  content: string, 
  itemName: string, 
  priceEffect: number
): Rumor {
  const newRumor: Rumor = {
    id: `rumor${++rumorCount}`,
    content: content,
    spread: 5, // starts with minimal spread
    affectedItem: itemName,
    priceEffect: priceEffect,
    duration: 4, // lasts for 4 turns by default
    verified: true, // custom rumors are true by default
    origin: "your own whispers",
    turnsActive: 0
  };
  
  state.rumors.push(newRumor);
  return newRumor;
}