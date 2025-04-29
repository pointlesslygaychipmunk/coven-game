import { TimeManager } from './time';

export class Plant {
  name: string;
  growthStage: number;
  watered: boolean;

  constructor(name: string) {
    this.name = name;
    this.growthStage = 0;
    this.watered = false;
  }

  grow(time: TimeManager) {
    if (this.watered) {
      this.growthStage += 1;
    }
    this.watered = false;
  }

  isMature(): boolean {
    return this.growthStage >= 3;
  }
}
