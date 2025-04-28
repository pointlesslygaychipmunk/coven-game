import { GardenSlot, CropType } from "@shared/types";

/** Advance growth for all crops in the garden by one stage, and mark dead crops. */
export function growGarden(garden: GardenSlot[]): GardenSlot[] {
  return garden.map(slot => {
    if (slot.dead) {
      // If the crop is already dead, leave it as is
      return slot;
    }
    const newGrowth = slot.growth + 1;
    return {
      ...slot,
      growth: newGrowth,
      dead: newGrowth > 6   // mark as dead if growth exceeds 6 (example threshold)
    };
  });
}

/** Water all living crops in the garden (sets watered flag to true for each). */
export function waterGarden(garden: GardenSlot[]): GardenSlot[] {
  return garden.map(slot =>
    slot.dead ? slot : { ...slot, watered: true }
  );
}

/** Count how many living crops of a given type are in the garden. */
export function countLiving(garden: GardenSlot[], cropType: CropType): number {
  return garden.filter(slot => slot.crop === cropType && !slot.dead).length;
}
