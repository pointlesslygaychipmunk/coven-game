import { ITEMS } from './items';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

export class Inventory {
  items: InventoryItem[];

  constructor() {
    this.items = [];
  }

  initializeStarter() {
    this.addItem('Moonbud Seed', 2);
    this.addItem('Glimmerroot Seed', 2);
    this.addItem('Ancient Ginseng', 1);
    this.addItem('Sacred Lotus', 1);
  }

  addItem(name: string, quantity: number) {
    const existing = this.items.find(i => i.name === name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ id: name, name, quantity });
    }
  }

  removeItem(name: string, quantity: number) {
    const existing = this.items.find(i => i.name === name);
    if (existing && existing.quantity >= quantity) {
      existing.quantity -= quantity;
      if (existing.quantity <= 0) {
        this.items = this.items.filter(i => i.name !== name);
      }
      return true;
    }
    return false;
  }
}
