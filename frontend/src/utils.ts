import { Player, TownRequestCard } from "../../shared/types";

export function plantCrop(
  player: Player,
  cropType: "mushroom" | "flower" | "herb",
  plotIndex: number
): Player {
  if (plotIndex < 0 || plotIndex >= 8) throw Error("Invalid garden index.");
  if (player.garden.spaces[plotIndex] !== null)
    throw Error(`Plot ${plotIndex} is already occupied.`);
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

export function plantTree(player: Player, plotIndex: number): Player {
  if (plotIndex < 0 || plotIndex >= 8) throw Error("Invalid plot.");
  if (player.garden.spaces[plotIndex] !== null)
    throw Error("Plot already occupied.");
  const newPlayer = structuredClone(player);
  newPlayer.garden.spaces[plotIndex] = {
    kind: "tree",
    growth: 1,
    isDead: false
  };
  return newPlayer;
}

export function fellTree(player: Player, plotIndex: number): Player {
  const slot = player.garden.spaces[plotIndex];
  if (!slot || slot.kind !== "tree") throw Error("No tree here.");
  const newPlayer = structuredClone(player);
  newPlayer.garden.spaces[plotIndex] = null;
  return newPlayer;
}

export function harvestCrop(player: Player, indexes: number[]): Player {
  const thresholds: Record<"mushroom" | "flower" | "herb", number> = {
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

export function brewPotions(
  player: Player,
  potionMap: Record<"mushroom" | "flower" | "herb" | "fruit", number>
): Player {
  const newPlayer = structuredClone(player);
  for (const key in potionMap) {
    const k = key as keyof typeof potionMap;
    if (newPlayer.inventory[k] < potionMap[k])
      throw Error(`Not enough ${k}s`);
    newPlayer.inventory[k] -= potionMap[k];
    newPlayer.potions[k] += potionMap[k];
  }
  newPlayer.mana = Math.max(newPlayer.mana - 1, 0);
  return newPlayer;
}

export function fulfillTownRequest(
  player: Player,
  card: TownRequestCard
): Player {
  const needs = card.potionNeeds;
  const newPlayer = structuredClone(player);
  for (const key in needs) {
    const k = key as keyof typeof needs;
    if (newPlayer.potions[k] < needs[k])
      throw Error(`Missing ${k} potions`);
    newPlayer.potions[k] -= needs[k];
  }
  newPlayer.gold += 2 + card.craftPoints;
  newPlayer.renown += 1;
  return newPlayer;
}

export const postUpdate = (
  endpoint: string,
  body: any,
  setGameState: (val: any) => void
) => {
  fetch(`https://api.telecrypt.xyz/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => setGameState(data))
    .catch(err => console.error(`${endpoint} error:`, err));
};