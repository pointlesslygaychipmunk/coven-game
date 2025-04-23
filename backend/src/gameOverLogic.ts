import { Player } from "../../shared/types";

type ScoreBreakdown = Record<string, number>;

export function calculateScore(player: Player): {
  total: number;
  breakdown: ScoreBreakdown;
  lost: boolean;
} {
  const renown = player.renown ?? 0;
  const goldPoints = Math.floor((player.gold ?? 0) / 10);

  const inventory = player.inventory ?? {};
  const upgrades = player.upgrades ?? {};

  const mushroomPoints = inventory["mushroom"] ?? 0;
  const flowerPoints = inventory["flower"] ?? 0;
  const herbPoints = inventory["herb"] ?? 0;
  const fruitPoints = inventory["fruit"] ?? 0;

  const upgradeLevels =
    (upgrades["well"] ?? 0) +
    (upgrades["cellar"] ?? 0) +
    (upgrades["cart"] ?? 0) +
    (upgrades["cauldron"] ?? 0);

  const upgradePoints = upgradeLevels * 2;

  const treePoints =
    player.garden?.spaces?.filter(
      (s) => s && "type" in s && s.type === "tree" && !s.isDead
    ).length ?? 0;

  const potionCounts = player["potions"] ?? {};
  const potionPoints =
    (potionCounts["mushroom"] ?? 0) +
    (potionCounts["flower"] ?? 0) +
    (potionCounts["herb"] ?? 0) +
    (potionCounts["fruit"] ?? 0);

  const total =
    renown + goldPoints + mushroomPoints + flowerPoints + herbPoints + fruitPoints + upgradePoints + treePoints + potionPoints;

  const breakdown: ScoreBreakdown = {
    renown,
    gold: goldPoints,
    mushroom: mushroomPoints,
    flower: flowerPoints,
    herb: herbPoints,
    fruit: fruitPoints,
    upgrades: upgradePoints,
    trees: treePoints,
    potions: potionPoints,
  };

  const lost = player.renown <= 0 || potionPoints === 0;

  return { total, breakdown, lost };
}