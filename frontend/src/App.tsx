import { useEffect, useState } from 'react';
import GardenGrid from './components/GardenGrid';
import Inventory from './components/Inventory';
import Market from './components/Market';
import Journal from './components/Journal';
import type { GameState, Player, InventoryItem, GameAction } from '../../shared/src/types';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [journalTab, setJournalTab] = useState<'Events' | 'Rumors' | 'Ritual' | 'Overview'>('Events');

  // Fetch initial game state from server
  useEffect(() => {
    fetch('/state')
      .then(res => res.json())
      .then(data => setGameState(data))
      .catch(err => console.error('Failed to load game state', err));
  }, []);

  const sendAction = async (action: GameAction) => {
    try {
      const res = await fetch('/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action)
      });
      const data: GameState | { error: string } = await res.json();
      if (res.ok) {
        setGameState(data as GameState);
        setSelectedItem(null);
      } else {
        console.error('Action error:', (data as any).error);
        // In a real app, show user feedback (alert/toast)
      }
    } catch (err) {
      console.error('Failed to send action', err);
    }
  };

  if (!gameState) {
    return <div className="p-4">Loading game...</div>;
  }
  // Determine current player object
  const currentPlayer: Player | undefined = gameState.players.find(p => p.id === gameState.status.currentPlayer);
  const otherPlayers: Player[] = gameState.players.filter(p => p.id !== gameState.status.currentPlayer);

  const tabs: Array<'Events' | 'Rumors' | 'Ritual' | 'Overview'> = ['Events','Rumors','Ritual','Overview'];

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Panel: Garden and Inventory */}
      <div className="p-4 flex-1">
        <h2 className="text-xl font-bold mb-2">
          Garden – {currentPlayer?.name}'s Garden (Turn {gameState.status.turn})
        </h2>
        <div className="mb-4">
          {currentPlayer && (
            <GardenGrid 
              garden={currentPlayer.garden} 
              selectedItem={selectedItem} 
              onSlotClick={(slotId) => {
                if (!currentPlayer) return;
                const slot = currentPlayer.garden.find(s => s.id === slotId);
                if (!slot) return;
                if (slot.plant === null) {
                  // If empty slot, try to plant if a seed is selected
                  if (selectedItem && selectedItem.category === 'seed') {
                    sendAction({ type: 'plant', playerId: currentPlayer.id, seedName: selectedItem.name, slotId: slotId });
                  }
                } else {
                  // Slot has a plant
                  if (slot.plant.growth >= slot.plant.growthRequired) {
                    // Fully grown, harvest it
                    sendAction({ type: 'harvest', playerId: currentPlayer.id, slotId: slotId });
                  } else if (!slot.plant.watered) {
                    // Not fully grown and not yet watered, water it
                    sendAction({ type: 'water', playerId: currentPlayer.id, slotId: slotId });
                  }
                }
              }}
            />
          )}
        </div>
        <h2 className="text-lg font-semibold mb-2">
          Inventory – {currentPlayer?.name} (Gold: {currentPlayer?.gold})
        </h2>
        {currentPlayer && (
          <Inventory 
            inventory={currentPlayer.inventory} 
            selectedItem={selectedItem} 
            onSelectItem={(item) => {
              if (selectedItem && selectedItem.name === item.name) {
                // Deselect if clicking the same item
                setSelectedItem(null);
              } else {
                setSelectedItem(item);
              }
            }}
          />
        )}
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          onClick={() => {
            if (currentPlayer) {
              sendAction({ type: 'endTurn', playerId: currentPlayer.id });
            }
          }}
          disabled={gameState.status.status !== 'ongoing' || !currentPlayer}
        >
          End Turn
        </button>
      </div>

      {/* Right Panel: Market and Journal */}
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-xl font-bold mb-2">Market</h2>
        <Market 
          market={gameState.market} 
          playerGold={currentPlayer?.gold || 0}
          inventory={currentPlayer?.inventory || []}
          onBuy={(itemName) => {
            if (currentPlayer) {
              sendAction({ type: 'buy', playerId: currentPlayer.id, itemName });
            }
          }}
          onSell={(itemName) => {
            if (currentPlayer) {
              sendAction({ type: 'sell', playerId: currentPlayer.id, itemName });
            }
          }}
        />

        <h2 className="text-xl font-bold mt-4">Journal</h2>
        <div className="mb-2">
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={`px-3 py-1 mr-2 rounded-t ${journalTab === tab ? 'bg-gray-700' : 'bg-gray-600 hover:bg-gray-500'}`}
              onClick={() => setJournalTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-800 p-2 rounded">
          <Journal 
            gameState={gameState}
            currentPlayer={currentPlayer} 
            otherPlayers={otherPlayers}
            tab={journalTab}
            onStartRumor={(content) => {
              if (currentPlayer) {
                sendAction({ type: 'startRumor', playerId: currentPlayer.id, content });
              }
            }}
            onPerformRitual={() => {
              if (currentPlayer) {
                sendAction({ type: 'performRitual', playerId: currentPlayer.id });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
