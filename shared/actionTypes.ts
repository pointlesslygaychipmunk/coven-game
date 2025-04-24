export interface PlantAction {
    type: "plant";
    plotIndex: number;
    itemType: "mushroom" | "flower" | "herb" | "fruit";
  }
  
  export type Action = PlantAction; // Expand this as more actions are added
  