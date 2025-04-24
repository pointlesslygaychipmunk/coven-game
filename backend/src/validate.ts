import type {
  GameState,
  TownRequestCard,
  PotionType,
  CropType,
} from "../../shared/types";

type ValidationResult = { valid: true; state: GameState } | { valid: false; error: string };

const isCropType = (val: any): val is Exclude<PotionType, "fruit"> =>
  val === "mushroom" || val === "flower" || val === "herb";

// 🌿 Harvest crops that are ready and not dead
export function validateHarvest(gameState: GameState): ValidationResult {
  const updated = structuredClone(gameState);
  const thresholds: Record<Exclude<PotionType, "fruit">, number> = {
    mushroom: 4,
    flower: 3,
    herb: 2,
  };

  updated.player.garden.spaces.forEach((slot, index) => {
    if (slot && slot.kind === "crop" && !slot.isDead && slot.growth >= thresholds[slot.type]) {
      updated.player.inventory[slot.type]++;
      updated.player.garden.spaces[index] = null;
    }
  });

  return { valid: true, state: updated };
}

// 🧪 Brew potions (simple validation for now)
export function validateBrew(gameState: GameState, potion: PotionType): ValidationResult {
  const updated = structuredClone(gameState);
  if (updated.player.inventory[potion] <= 0) {
    return { valid: false, error: `Not enough ${potion} to brew.` };
  }

  updated.player.inventory[potion]--;
  updated.player.potions[potion]++;
  return { valid: true, state: updated };
}

// 📦 Fulfill a town request
export function validateFulfill(gameState: GameState, card: TownRequestCard): ValidationResult {
  const updated = structuredClone(gameState);

  for (const key in card.potionNeeds) {
    const needed = card.potionNeeds[key as PotionType];
    if (updated.player.potions[key as PotionType] < needed) {
      return { valid: false, error: `Not enough ${key} potions.` };
    }
  }

  for (const key in card.potionNeeds) {
    updated.player.potions[key as PotionType] -= card.potionNeeds[key as PotionType];
  }

  updated.player.gold += card.reward.gold;
  updated.player.renown += card.reward.renown;

  const request = updated.townRequests.find(r => r.id === card.id);
  if (request) request.fulfilled = true;

  return { valid: true, state: updated };
}

// 🌱 Plant crop
export function validatePlantCrop(
  gameState: GameState,
  crop: Exclude<PotionType, "fruit">,
  index: number
): ValidationResult {
  if (gameState.player.garden.spaces[index]) {
    return { valid: false, error: "Plot already occupied." };
  }
  if (gameState.player.inventory[crop] <= 0) {
    return { valid: false, error: `No ${crop} left to plant.` };
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
export function validatePlantTree(
  gameState: GameState,
  index: number
): ValidationResult {
  if (gameState.player.garden.spaces[index]) {
    return { valid: false, error: "Plot already occupied." };
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
    return { valid: false, error: "No tree to fell here." };
  }

  const updated = structuredClone(gameState);
  updated.player.garden.spaces[index] = null;
  return { valid: true, state: updated };
}

// 💦 Water crop or tree
export function validateWater(gameState: GameState, index: number): ValidationResult {
  const updated = structuredClone(gameState);
  const slot = updated.player.garden.spaces[index];

  if (!slot || slot.isDead) {
    return { valid: false, error: "Nothing to water here." };
  }

  slot.growth += 1;
  return { valid: true, state: updated };
}

// 🛒 Buy item
export function validateBuy(gameState: GameState, item: PotionType, quantity: number): ValidationResult {
  const updated = structuredClone(gameState);
  const price = updated.market[item]?.price ?? 0;
  const totalCost = price * quantity;

  if (updated.player.gold < totalCost) {
    return { valid: false, error: "Not enough gold." };
  }

  updated.player.gold -= totalCost;
  updated.player.inventory[item] += quantity;
  return { valid: true, state: updated };
}

// 💰 Sell item
export function validateSell(gameState: GameState, item: PotionType, quantity: number): ValidationResult {
  const updated = structuredClone(gameState);
  if (updated.player.inventory[item] < quantity) {
    return { valid: false, error: `Not enough ${item} to sell.` };
  }

  const price = updated.market[item]?.price ?? 0;
  const totalGain = price * quantity;

  updated.player.inventory[item] -= quantity;
  updated.player.gold += totalGain;
  return { valid: true, state: updated };
}

// 🛠️ Upgrade system
export function validateUpgrade(gameState: GameState, upgraded: "well" | "cellar" | "cart" | "cauldron"): ValidationResult {
  const updated = structuredClone(gameState);
  const cost = 5 + updated.player.upgrades[upgraded];

  if (updated.player.gold < cost) {
    return { valid: false, error: "Not enough gold for upgrade." };
  }

  updated.player.gold -= cost;
  updated.player.upgrades[upgraded] += 1;
  return { valid: true, state: updated };
}

// 🌘 Advance turn (trivial)
export function validateAdvance(gameState: GameState): ValidationResult {
  return { valid: true, state: structuredClone(gameState) };
}