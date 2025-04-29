// frontend/src/components/Requests.tsx
import React from 'react';
import { TownRequest, Player } from '../types';

interface RequestsProps {
  requests: TownRequest[];
  player: Player;
  onFulfill: (requestId: string) => void;
}

const Requests: React.FC<RequestsProps> = ({ requests, player, onFulfill }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Town Requests</h2>
      {requests.length === 0 ? (
        <p className="text-sm text-gray-500">No active requests at the moment.</p>
      ) : (
        <ul className="space-y-2">
          {requests.map(req => {
            const canFulfill = player.inventory.find(item => item.name === req.item && item.quantity >= req.quantity);
            return (
              <li key={req.id} className="p-2 border rounded">
                <div className="text-sm">
                  <strong>{req.quantity}x {req.item}</strong> needed 
                  — Reward: {req.rewardGold} gold, {req.rewardInfluence} rep
                </div>
                <button 
                  onClick={() => onFulfill(req.id)} 
                  disabled={!canFulfill} 
                  className={`mt-1 px-2 py-1 text-sm rounded ${canFulfill ? 'bg-indigo-100 hover:bg-indigo-200' : 'bg-gray-200'}`}
                >
                  Fulfill
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="mt-2 text-sm text-gray-600">
        <p>Reputation: {player.reputation}</p>
      </div>
    </div>
  );
};

export default Requests;
