// backend/gardenLogic.ts

import type { Player, PotionType, CropType } from "../../shared/types";

const cropThresholds: Record<CropType, number> = {
  mushroom: 4,
  flower: 3,
  herb: 2,
};

export function plantCrop(player: Player, type: CropType, index: number): Player {
  const updated = structuredClone(player);

  if (updated.garden.spaces[index] !== null) {
    updated.alerts.push("❌ That plot is already occupied.");
    return updated;
  }

  if (updated.inventory[type] <= 0) {
    updated.alerts.push(`❌ No ${type} left in your inventory.`);
    return updated;
  }

  updated.inventory[type]--;
  updated.garden.spaces[index] = {
    kind: "crop",
    type,
    growth: 1,
    isDead: false,
  };

  updated.alerts.push(`🌱 Planted a ${type}.`);
  return updated;
}

export function plantTree(player: Player, index: number): Player {
  const updated = structuredClone(player);

  if (updated.garden.spaces[index] !== null) {
    updated.alerts.push("❌ That plot is already occupied.");
    return updated;
  }

  if (updated.inventory.fruit <= 0) {
    updated.alerts.push("❌ No fruit left to plant a tree.");
    return updated;
  }

  updated.inventory.fruit--;
  updated.garden.spaces[index] = {
    kind: "tree",
    growth: 1,
    isDead: false,
  };

  updated.alerts.push("🌳 Planted a tree.");
  return updated;
}

export function harvestCrop(player: Player, index: number): Player {
  const updated = structuredClone(player);
  const slot = updated.garden.spaces[index];

  if (!slot || slot.kind !== "crop") {
    updated.alerts.push("❌ Nothing to harvest.");
    return updated;
  }

  if (slot.isDead || slot.growth < cropThresholds[slot.type]) {
    updated.alerts.push(`🌾 Removed immature or dead ${slot.type}.`);
  } else {
    updated.alerts.push(`🌾 Harvested a mature ${slot.type}.`);
    updated.inventory[slot.type]++;
  }

  updated.garden.spaces[index] = null;
  return updated;
}

export function fellTree(player: Player, index: number): Player {
  const updated = structuredClone(player);
  const slot = updated.garden.spaces[index];

  if (!slot || slot.kind !== "tree") {
    updated.alerts.push("❌ No tree to fell here.");
    return updated;
  }

  updated.alerts.push("🪓 Felled a tree.");
  updated.garden.spaces[index] = null;
  return updated;
}

export function waterCrop(player: Player, index: number): Player {
  const updated = structuredClone(player);
  const slot = updated.garden.spaces[index];

  if (!slot || slot.kind !== "crop") {
    updated.alerts.push("❌ You can only water crops.");
    return updated;
  }

  if (updated.upgrades.well <= 0) {
    updated.alerts.push("💧 You need to build a well to water crops.");
    return updated;
  }

  const waterAvailable = updated.upgrades.well * 2;
  if (updated.wateringUsed >= waterAvailable) {
    updated.alerts.push("💧 You've used all your water this moon.");
    return updated;
  }

  slot.growth += 1;
  updated.wateringUsed = (updated.wateringUsed ?? 0) + 1;

  updated.alerts.push(`💧 Watered your ${slot.type}.`);
  return updated;
}