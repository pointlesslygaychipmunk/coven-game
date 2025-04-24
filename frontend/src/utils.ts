// utils.ts

import type { Player, TownRequestCard, PotionType } from "../../shared/types";

/** 🪴 PLANT CROP */
export function plantCrop(
  player: Player,
  cropType: Exclude<PotionType, "fruit">,
  plotIndex: number
): Player {
  if (plotIndex < 0 || plotIndex >= 8) throw Error("Invalid garden index.");
  if (player.garden.spaces[plotIndex] !== null) throw Error(`Plot ${plotIndex} is already occupied.`);
  if (player.inventory[cropType] < 1) throw Error("Not enough crops.");
  const waterLimit = player.upgrades.well * 2;
  if (waterLimit < 1) throw Error("Not enough water in your well.");

  const newPlayer = structuredClone(player);
  newPlayer.inventory[cropType] -= 1;
  newPlayer.garden.spaces[plotIndex] = {
    kind: "crop",
    type: cropType,
    growth: 1,
    isDead: false,
  };
  return newPlayer;
}

/** 🌳 PLANT TREE */
export function plantTree(player: Player, plotIndex: number): Player {
  if (plotIndex < 0 || plotIndex >= 8) throw Error("Invalid plot.");
  if (player.garden.spaces[plotIndex] !== null) throw Error("Plot already occupied.");

  const newPlayer = structuredClone(player);
  newPlayer.garden.spaces[plotIndex] = {
    kind: "tree",
    growth: 1,
    isDead: false
  };
  return newPlayer;
}

/** 🪓 FELL TREE */
export function fellTree(player: Player, plotIndex: number): Player {
  const slot = player.garden.spaces[plotIndex];
  if (!slot || slot.kind !== "tree") throw Error("No tree here.");

  const newPlayer = structuredClone(player);
  newPlayer.garden.spaces[plotIndex] = null;
  return newPlayer;
}

/** 🌾 HARVEST CROP */
export function harvestCrop(player: Player, indexes: number[]): Player {
  const thresholds: Record<Exclude<PotionType, "fruit">, number> = {
    mushroom: 4,
    flower: 3,
    herb: 2,
  };

  const newPlayer = structuredClone(player);
  for (const i of indexes) {
    const slot = newPlayer.garden.spaces[i];
    if (!slot || slot.kind !== "crop" || slot.isDead) continue;
    if (slot.growth >= thresholds[slot.type]) {
      newPlayer.inventory[slot.type] += 1;
      newPlayer.garden.spaces[i] = null;
    }
  }
  return newPlayer;
}

/** 🌙 GROW GARDEN */
export function growGarden(player: Player): Player {
  const newPlayer = structuredClone(player);
  for (let i = 0; i < newPlayer.garden.spaces.length; i++) {
    const slot = newPlayer.garden.spaces[i];
    if (!slot) continue;
    if (slot.kind === "crop" || slot.kind === "tree") {
      slot.growth += 1;
    }
  }
  return newPlayer;
}

/** 🧪 BREW POTIONS */
export function brewPotions(
  player: Player,
  potionMap: Record<PotionType, number>
): Player {
  const newPlayer = structuredClone(player);
  for (const key in potionMap) {
    const k = key as PotionType;
    const required = potionMap[k];
    if (newPlayer.inventory[k] < required) throw Error(`Not enough ${k}s`);
    newPlayer.inventory[k] -= required;
    newPlayer.potions[k] += required;
  }
  newPlayer.mana = Math.max(newPlayer.mana - 1, 0);
  return newPlayer;
}

/** 📦 FULFILL TOWN REQUEST */
export function fulfillTownRequest(
  player: Player,
  card: TownRequestCard
): Player {
  const newPlayer = structuredClone(player);
  for (const k in card.potionNeeds) {
    const key = k as PotionType;
    if (newPlayer.potions[key] < card.potionNeeds[key]) {
      throw Error(`Missing ${key} potions`);
    }
    newPlayer.potions[key] -= card.potionNeeds[key];
  }
  newPlayer.gold += card.reward.gold;
  newPlayer.renown += card.reward.renown;
  return newPlayer;
}

/** 🌐 POST UPDATE TO BACKEND */
export const postUpdate = async (
  endpoint: string,
  body: any,
  setGameState: (state: any) => void
) => {
  try {
    const res = await fetch(`https://api.telecrypt.xyz/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setGameState(data);
  } catch (err) {
    console.error(`${endpoint} error:`, err);
  }
};