import { useEffect, useState } from 'react';
import GardenGrid from './components/GardenGrid';
import Inventory from './components/Inventory';
import Market from './components/Market';
import Journal from './components/Journal';
import type { GameState, GameAction, Player } from '@shared/types';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    fetch('/state')
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error('Failed to load game', err));
  }, []);

  const sendAction = async (action: GameAction) => {
    const res = await fetch('/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action)
    });
    const data = await res.json();
    setGameState(data);
  };

  if (!gameState) return <div className="p-8 text-lg">Loading Coven...</div>;

  const currentPlayer: Player | undefined = gameState.players.find(p => p.id === gameState.status.currentPlayer);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Garden and Inventory */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-2">Garden 🌿</h1>
        {currentPlayer && (
          <GardenGrid
            garden={currentPlayer.garden}
            onPlant={(slotId, seedName) => sendAction({ type: 'plant', playerId: currentPlayer.id, slotId, seedName })}
            onWater={(slotId) => sendAction({ type: 'water', playerId: currentPlayer.id, slotId })}
            onHarvest={(slotId) => sendAction({ type: 'harvest', playerId: currentPlayer.id, slotId })}
          />
        )}

        <h2 className="text-xl font-semibold mt-6 mb-2">Inventory 🎒</h2>
        {currentPlayer && (
          <Inventory
            inventory={currentPlayer.inventory}
            onBuy={(item) => sendAction({ type: 'buy', playerId: currentPlayer.id, itemName: item })}
            onSell={(item) => sendAction({ type: 'sell', playerId: currentPlayer.id, itemName: item })}
          />
        )}
      </div>

      {/* Market and Journal */}
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold mb-2">Market 🛒</h2>
        <Market market={gameState.market} player={currentPlayer} sendAction={sendAction} />

        <h2 className="text-2xl font-bold mt-6 mb-2">Journal 📜</h2>
        <Journal log={gameState.log} />
      </div>
    </div>
  );
}

export default App;
