import { Player } from '../../shared/types';

type UpgradeType = 'well' | 'cellar' | 'cart' | 'cauldron';

export function upgrade(player: Player, type: UpgradeType) {
  const currentLevel = player.upgrades[type];
  const maxLevel = 3;
  if (currentLevel >= maxLevel) throw new Error('Already at max level');

  const costGold = (currentLevel + 1) * 4;
  const costCraft = (currentLevel + 1) * 2;

  if (player.gold < costGold || player.craftPoints < costCraft) {
    throw new Error('Not enough resources');
  }

  player.gold -= costGold;
  player.craftPoints -= costCraft;
  player.upgrades[type] += 1;
}
