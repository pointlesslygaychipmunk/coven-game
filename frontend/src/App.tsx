import React, { useState } from "react";
import type { GameState, Player, GardenSlot } from "@shared/types";
import GardenGrid from "./components/GardenGrid";
import "./index.css";

/** Create an empty garden with 8 slots (all unplanted mushrooms). */
function makeEmptyGarden(): GardenSlot[] {
  return Array.from({ length: 8 }, () => ({
    crop: "mushroom",
    kind: "crop",
    growth: 0,
    dead: false,
    watered: false
  }));
}

/** Initial mock game state for the frontend application. */
const initialState: GameState = {
  players: [
    {
      id: "player-1",
      name: "Witch Hazel",
      inventory: { mushroom: 2, flower: 2, herb: 2, fruit: 2 },
      potions: [],
      garden: makeEmptyGarden(),
      gold: 10,
      mana: 3,
      renown: 3,
      craftPoints: 0,
      upgrades: { well: 0, cart: 0, cellar: 0, cauldron: 0 },
      wateringUsed: 0,
      journal: [],
      rumorsHeard: [],
      memory: [],
      familiarPowers: [],
      ascendancy: { path: "", progress: 0, unlocked: false },
      quests: []
    }
  ],
  market: {
    items: {
      mushroom: { type: "crop", price: 3, stock: 5 },
      flower:   { type: "crop", price: 2, stock: 6 },
      herb:     { type: "ingredient", price: 4, stock: 4 },
      fruit:    { type: "crop", price: 5, stock: 3 }
    }
  },
  townRequests: [],
  quests: [],
  rumors: [],
  journal: [],
  status: { year: 1, moonPhase: 1, season: "spring", weather: "sunny" },
  actionsUsed: 0
};

function App() {
  const [gameState, setGameState] = useState<GameState>(initialState);

  return (
    <div className="app-container">
      <h1 className="text-2xl font-bold mb-4">Coven Game</h1>
      {/* Render the garden of the first player as an example */}
      <GardenGrid garden={gameState.players[0].garden} />
      {/* Additional UI components (inventory, market, etc.) would go here */}
    </div>
  );
}

export default App;
