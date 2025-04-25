import { GameState, Potion, Player, CropType } from "../../shared/types";

interface Action {
  type: string;
  payload?: any;
}
import { v4 as uuidv4 } from "uuid";

function getPlayerById(state: GameState, playerId: string): Player {
  const player = state.players.find((p: Player) => p.id === playerId);
  if (!player) throw new Error(`Player with ID "${playerId}" not found`);
  return player;
}

export function executeActions(gameState: GameState, actions: Action[], playerId: string): GameState {
  const player = getPlayerById(gameState, playerId);

  for (const action of actions) {
    const payload = action.payload || {};

    switch (action.type) {
      case "plant": {
        const crop = payload.crop as CropType;
        if (crop && player.inventory[crop] > 0) {
          player.garden.push({
            kind: crop === "tree" as CropType ? "tree" : "crop",
            type: crop,
            growth: 0,
            isDead: false,
          });
          player.inventory[crop]--;
        }
        break;
      }

      case "harvest": {
        const crop = payload.crop as CropType;
        if (!crop) break;
        const index = player.garden.findIndex(
          (slot) => slot && slot.type === crop && slot.growth >= 3 && !slot.isDead
        );
        if (index >= 0) {
          player.inventory[crop]++;
          player.garden.splice(index, 1);
        }
        break;
      }

      case "water": {
        player.wateringUsed++;
        break;
      }

      case "brew": {
        const { name, tier, ingredients } = payload;
        if (name && tier && ingredients) {
          const newPotion: Potion = {
            id: uuidv4(),
            name,
            tier,
            ingredients,
          };
          player.potions.push(newPotion);
          player.craftPoints += tier === "common" ? 1 :
                                tier === "rare"   ? 2 :
                                tier === "epic"   ? 3 :
                                tier === "legendary" ? 4 : 0;
        }
        break;
      }

      case "sell": {
        const { potionName, goldEarned } = payload;
        if (potionName && typeof goldEarned === "number") {
          const index = player.potions.findIndex((p) => p.name === potionName);
          if (index !== -1) {
            player.potions.splice(index, 1);
            player.gold += goldEarned;
          }
        }
        break;
      }

      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  return gameState;
}