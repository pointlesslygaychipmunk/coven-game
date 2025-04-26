// frontend/src/App.tsx
import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import type { GameState, Action }   from '../../shared/types';
import { Market }                   from './components/Market';
import { TownRequests }             from './components/TownRequests';
import { Journal }                  from './components/Journal';
import { RumorFeed }                from './components/RumorFeed';

const socket = io("https://playcoven.com");

const App: React.FC = () => {
  const [state, setState] = useState<GameState | null>(null);
  const playerId = state?.players[0]?.id ?? 'player1';

  // subscribe to server state updates & register once per playerId
  useEffect(() => {
    socket.on('state', (gs: GameState) => setState(gs));
    socket.emit('register', { playerId });
    return () => {
      socket.off('state');
    };
  }, [playerId]);

  if (!state) return <div>Loading…</div>;

  // helper to send any batch of actions
  const doActions = (actions: Action[]) =>
    socket.emit('executeActions', { playerId, actions });

  return (
    <div className="p-4 space-y-6">
      {/* 🗓️ Status Bar */}
      <div className="flex justify-between items-center mb-4">
        <span>📅 Year {state.status.year}, {state.status.season}</span>
        <span>🌙 Moon Phase {state.status.moonPhase}</span>
        <span>☀️ Weather: {state.status.weather}</span>
      </div>

      {/* 🏬 Market + 🗣️ Rumor Feed */}
      <div className="flex gap-6">
        <Market
          marketItems={state.market.items}
          onBuy={id => doActions([{ type: 'buy',     itemId: id, quantity: 1 }])}
          onSell={id => doActions([{ type: 'sell',    itemId: id, quantity: 1 }])}
          onAcquireBlack={id => doActions([{ type: 'buy', itemId: id, quantity: 1 }])}
        />
        <RumorFeed />
      </div>

      {/* 📜 Town Requests */}
      <TownRequests
        cards={state.townRequests}
        onFulfill={reqId => doActions([{ type: 'fulfill', requestId: reqId }])}
      />

      {/* 🕯️ Journal */}
      <Journal alerts={state.journal} />

      {/* ▶️ Advance Turn */}
      <button
        onClick={() => socket.emit('advanceTurn')}
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
      >
        Advance Turn
      </button>
    </div>
  );
};

export default App;