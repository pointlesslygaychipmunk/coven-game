export interface PlantAction {
    type: "plant";
    plotIndex: number;
    itemType: "mushroom" | "flower" | "herb" | "fruit";
  }
  
  // ⏳ Placeholder for future action types — you can expand these as you go:
  export interface HarvestAction {
    type: "harvest";
    plotIndex: number;
  }
  
  export interface BrewAction {
    type: "brew";
    potionType: string;
  }
  
  export interface BuyAction {
    type: "buy";
    item: string;
    quantity: number;
  }
  
  export interface SellAction {
    type: "sell";
    item: string;
    quantity: number;
  }
  
  export interface UpgradeAction {
    type: "upgrade";
    upgradeId: string;
  }
  
  export interface FulfillAction {
    type: "fulfill";
    requestId: string;
  }
  
  export interface AdvanceAction {
    type: "advance";
  }

  export interface FellAction {
    type: "fell";
    plotIndex: number;
  }  
  
  // ✅ Union of all supported actions
  export type Action =
    | PlantAction
    | HarvestAction
    | BrewAction
    | BuyAction
    | SellAction
    | UpgradeAction
    | FulfillAction
    | AdvanceAction
    | FellAction; 