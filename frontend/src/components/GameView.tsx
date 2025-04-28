// frontend/src/components/GameView.tsx – Main game view combining all components
import React from 'react';
import type { GameState, Action } from '@shared/types';
import StatsBar from '@/components/StatsBar';
import GardenGrid from '@/components/GardenGrid';
import InventoryBox from '@/components/InventoryBox';
import PotionPanel from '@/components/PotionPanel';
import Market from '@/components/Market';
import TownRequests from '@/components/TownRequests';
import RumorFeed from '@/components/RumorFeed';
import Journal from '@/components/Journal';

interface GameViewProps {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

const GameView: React.FC<GameViewProps> = ({ state, dispatch }) => {
  const currentPlayer = state.players[state.currentPlayer ?? 0] ?? state.players[0];

  // Helper to send an action to the backend and update state
  const sendAction = async (action: Action) => {
    const res = await fetch('/api/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-player-id': player.id },
      body: JSON.stringify(action),
    });
    if (res.ok) {
      const newState: GameState = await res.json();
      dispatch({ type: 'loadState', state: newState });
    }
  };

  // Handlers for different actions
  const handleAction = (action: Action) => sendAction(action);
  const handleBuy = (itemId: string) => sendAction({ type: 'buy', itemId, quantity: 1 });
  const handleSell = (itemId: string) => sendAction({ type: 'sell', itemId, quantity: 1 });
  const handleFulfill = (requestId: string) => sendAction({ type: 'fulfill', requestId });
  const handleAdvanceTurn = async () => {
    const res = await fetch('/api/advance', { method: 'POST', headers: { 'x-player-id': player.id } });
    if (res.ok) {
      const newState: GameState = await res.json();
      dispatch({ type: 'loadState', state: newState });
    }
  };
  const handleBrewComplete = (newState: GameState) => {
    dispatch({ type: 'loadState', state: newState });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-stone-200">
      {/* Status bar */}
      <StatsBar player={player} status={state.status} onAdvanceTurn={handleAdvanceTurn} />

      {/* Main content columns */}
      <div className="flex flex-1">
        {/* Cottage Column */}
        <div className="flex flex-col w-2/3 p-4 gap-4 border-r border-stone-700/50">
          <h2 className="text-2xl shimmer-text mb-2">🌿 Cottage</h2>
          <GardenGrid tiles={player.garden} inventory={player.inventory} onAction={handleAction} />
          <InventoryBox items={player.inventory} />
          <PotionPanel player={player} onBrewComplete={handleBrewComplete} />
          <Journal log={state.journal} quests={state.quests} />
        </div>
        {/* Town Column */}
        <div className="flex flex-col w-1/3 p-4 gap-4">
          <h2 className="text-2xl shimmer-text mb-2">🏛️ Town</h2>
          <Market market={state.market} player={player} onBuy={handleBuy} onSell={handleSell} />
          <TownRequests cards={state.townRequests} player={player} onFulfill={handleFulfill} />
          <RumorFeed rumors={state.rumors} />
        </div>
      </div>
    </div>
  );
};

export default GameView;
