import { Plant } from './plant';
import { TimeManager } from './time';

export class Garden {
  slots: (Plant | null)[];

  constructor() {
    this.slots = Array(12).fill(null);
  }

  plantSeed(slot: number, name: string) {
    if (!this.slots[slot]) {
      this.slots[slot] = new Plant(name);
    }
  }

  waterAll() {
    this.slots.forEach(plant => {
      if (plant) plant.watered = true;
    });
  }

  advanceGrowth(time: TimeManager) {
    this.slots.forEach(plant => {
      if (plant) plant.grow(time);
    });
  }
}
