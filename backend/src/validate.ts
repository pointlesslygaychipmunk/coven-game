import type {
    GameState,
    TownRequestCard,
    PotionType,
    CropType,
    GardenSlot,
  } from "../../shared/types";
  import { simulateMoonPhaseChange } from "./moonLogic";
  import { updateMarketAI } from "./marketLogic";
  import { generateMarketEvent } from "./marketEvents";
  
  // ✨ Utility Type
  type ValidationResult = { valid: true; state: GameState } | { valid: false; error: string };
  
  // ✅ Internal guard
  const isCropType = (val: any): val is Exclude<PotionType, "fruit"> =>
    val === "mushroom" || val === "flower" || val === "herb";
  
  // 🌿 Harvest mature crops
  export function validateHarvest(gameState: GameState): ValidationResult {
    const thresholds: Record<Exclude<PotionType, "fruit">, number> = {
      mushroom: 4,
      flower: 3,
      herb: 2,
    };
  
    const updated = structuredClone(gameState);
  
    updated.player.garden.spaces.forEach((slot, idx) => {
      if (
        slot &&
        slot.kind === "crop" &&
        !slot.isDead &&
        slot.growth >= thresholds[slot.type]
      ) {
        updated.player.inventory[slot.type]++;
        updated.player.garden.spaces[idx] = null;
      }
    });
  
    return { valid: true, state: updated };
  }
  
  // 🧪 Brew stub
  export function validateBrew(_gameState: GameState): ValidationResult {
    return { valid: true, state: _gameState };
  }
  
  // 📦 Fulfill request
  export function validateFulfill(gameState: GameState, card: TownRequestCard): ValidationResult {
    const updated = structuredClone(gameState);
  
    for (const type of Object.keys(card.potionNeeds) as PotionType[]) {
      const need = card.potionNeeds[type];
      if (updated.player.potions[type] < need) {
        return { valid: false, error: `❌ Not enough ${type} potions.` };
      }
      updated.player.potions[type] -= need;
    }
  
    updated.player.gold += card.reward.gold;
    updated.player.renown += card.reward.renown;
    updated.townRequests = updated.townRequests.map((c) =>
      c.id === card.id ? { ...c, fulfilled: true } : c
    );
  
    updated.player.craftPoints += card.craftPoints;
  
    return { valid: true, state: updated };
  }
  
  // 🌱 Plant crop
  export function validatePlantCrop(
    gameState: GameState,
    crop: CropType,
    index: number
  ): ValidationResult {
    if (gameState.player.garden.spaces[index]) {
      return { valid: false, error: "❌ Plot already occupied." };
    }
  
    if (gameState.player.inventory[crop] <= 0) {
      return { valid: false, error: `❌ No ${crop} left to plant.` };
    }
  
    const updated = structuredClone(gameState);
    updated.player.inventory[crop]--;
    updated.player.garden.spaces[index] = {
      kind: "crop",
      type: crop,
      growth: 1,
      isDead: false,
    };
  
    return { valid: true, state: updated };
  }
  
  // 🌳 Plant tree
  export function validatePlantTree(gameState: GameState, index: number): ValidationResult {
    if (gameState.player.garden.spaces[index]) {
      return { valid: false, error: "❌ Plot already occupied." };
    }
  
    const updated = structuredClone(gameState);
    updated.player.garden.spaces[index] = {
      kind: "tree",
      growth: 1,
      isDead: false,
    };
  
    return { valid: true, state: updated };
  }
  
  // 🪓 Fell tree
  export function validateFellTree(gameState: GameState, index: number): ValidationResult {
    const slot = gameState.player.garden.spaces[index];
    if (!slot || slot.kind !== "tree") {
      return { valid: false, error: "❌ No tree to fell." };
    }
  
    const updated = structuredClone(gameState);
    updated.player.garden.spaces[index] = null;
  
    return { valid: true, state: updated };
  }
  
  // 🛒 Buy
  export function validateBuy(
    gameState: GameState,
    item: PotionType,
    quantity = 1
  ): ValidationResult {
    const updated = structuredClone(gameState);
    const marketItem = updated.market[item];
    const cost = marketItem.price * quantity;
  
    if (updated.player.gold < cost) {
      return { valid: false, error: `❌ Not enough gold to buy ${quantity} ${item}.` };
    }
  
    if (marketItem.stock < quantity) {
      return { valid: false, error: `❌ Not enough ${item} in stock.` };
    }
  
    updated.player.gold -= cost;
    updated.player.inventory[item] += quantity;
    updated.market[item].stock -= quantity;
  
    return { valid: true, state: updated };
  }
  
  // 💰 Sell
  export function validateSell(
    gameState: GameState,
    item: PotionType,
    quantity = 1
  ): ValidationResult {
    const updated = structuredClone(gameState);
  
    if (updated.player.inventory[item] < quantity) {
      return { valid: false, error: `❌ Not enough ${item} to sell.` };
    }
  
    const marketItem = updated.market[item];
    updated.player.inventory[item] -= quantity;
    updated.player.gold += marketItem.price * quantity;
    updated.market[item].stock += quantity;
  
    return { valid: true, state: updated };
  }
  
  // 🛠️ Upgrade
  export function validateUpgrade(gameState: GameState, upgradeId: keyof GameState["player"]["upgrades"]): ValidationResult {
    const updated = structuredClone(gameState);
  
    const cost = (updated.player.upgrades[upgradeId] + 1) * 5;
    if (updated.player.gold < cost) {
      return { valid: false, error: `❌ Not enough gold to upgrade ${upgradeId}.` };
    }
  
    updated.player.gold -= cost;
    updated.player.upgrades[upgradeId] += 1;
  
    return { valid: true, state: updated };
  }
  
  // 🌙 Advance moon (and apply growth/decay)
  export function validateAdvance(gameState: GameState): ValidationResult {
    const updated = structuredClone(gameState);
  
    simulateMoonPhaseChange(updated.player, updated.status);
    updated.status.moonPhase += 1;
  
    // Reset actions
    updated.actionsUsed = 0;
  
    // Market logic
    const memory = {
      purchases: { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
      sales: { mushroom: 0, flower: 0, herb: 0, fruit: 0 },
    };
  
    updated.market = updateMarketAI(updated.market, memory);
  
    const event = generateMarketEvent(updated.status.season, updated.status.moonPhase);
    updated.marketEvent = event
      ? { name: event.name, description: event.description }
      : null;
    if (event) updated.market = event.apply(updated.market);
  
    return { valid: true, state: updated };
  }  