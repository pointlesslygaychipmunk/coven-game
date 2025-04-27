import { GardenSlot, CropType } from '../../../shared/src/types';

export function growGarden(garden: GardenSlot[]): GardenSlot[] {
  return garden.map((slot) => {
    if (slot.isDead) return slot;
    const newGrowth = slot.growth + 1;
    return {
      ...slot,
      growth: newGrowth,
      isDead: newGrowth > 6,
    };
  });
}

export function waterGarden(garden: GardenSlot[]): GardenSlot[] {
  return garden.map((slot) =>
    slot.isDead ? slot : { ...slot, watered: true }
  );
}

export function countLiving(garden: GardenSlot[], type: CropType): number {
  return garden.filter((slot) => slot.type === type && !slot.isDead).length;
}