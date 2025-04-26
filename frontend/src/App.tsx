import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import type { GameState, Action } from '../../shared/types';
import StatsBar from './components/StatsBar';
import { GardenGrid } from './components/GardenGrid';
import { InventoryBox } from './components/InventoryBox';
import PotionPanel from './components/PotionPanel';
import { Market } from './components/Market';
import { TownRequests } from './components/TownRequests';
import RumorFeed from './components/RumorFeed';
import { Journal } from './components/Journal';

const socket = io('https://playcoven.com');

const App: React.FC = () => {
  const [state, setState] = useState<GameState | null>(null);
  const [journalOpen, setJournalOpen] = useState(false);
  const playerId = state?.players[0]?.id ?? 'player-1';

  useEffect(() => {
    socket.on('state', (gs: GameState) => setState(gs));
    socket.emit('register', { playerId });
    return () => void socket.off('state');
  }, [playerId]);

  if (!state) return <div className="text-purple-700">Loading Coven…</div>;

  const { players, market, townRequests, rumors, journal, status } = state;
  const player = players[0];

  const doAction = (action: Action) =>
    socket.emit('executeActions', { playerId, actions: [action] });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-200 min-h-screen">
      {/* 🗓️ Status Bar */}
      <StatsBar player={player} status={status} />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Garden, Inventory, Brewing */}
        <div className="space-y-4">
          <GardenGrid
            spaces={player.garden}
            player={player}
            onPlantCrop={(type, idx) => doAction({ type: 'plant', crop: type, index: idx })}
            onPlantTree={(idx) => doAction({ type: 'plant', crop: 'fruit', index: idx })}
            onWater={(idx) => doAction({ type: 'water', index: idx })}
            onHarvest={(idx) => doAction({ type: 'harvest', index: idx })}
          />
          <InventoryBox player={player} />
          <PotionPanel player={player} onBrew={(id) => doAction({ type: 'brew', potionId: id })} />
        </div>

        {/* Right: Market, Town, Rumors */}
        <div className="space-y-4">
          <Market
            marketItems={market.items}
            onBuy={(id) => doAction({ type: 'buy', itemId: id, quantity: 1 })}
            onSell={(id) => doAction({ type: 'sell', itemId: id, quantity: 1 })}
            onAcquireBlack={(id) => doAction({ type: 'buy', itemId: id, quantity: 1 })}
          />
          <TownRequests
            cards={townRequests}
            onFulfill={(reqId) => doAction({ type: 'fulfill', requestId: reqId })}
          />
          <RumorFeed rumors={rumors} />
        </div>
      </div>

      {/* Collapsible Journal */}
      <Journal
        alerts={journal}
        timestamps={[]}
        open={journalOpen}
        onToggle={() => setJournalOpen((o) => !o)}
      />
    </div>
  );
};

export default App;