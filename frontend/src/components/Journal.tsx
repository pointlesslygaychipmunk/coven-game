import React, { useState } from 'react';
import type { GameState, Player } from '../../../shared/src/types';

interface JournalProps {
  gameState: GameState;
  currentPlayer: Player | undefined;
  otherPlayers: Player[];
  tab: 'Events' | 'Rumors' | 'Ritual' | 'Overview';
  onStartRumor: (content: string) => void;
  onPerformRitual: () => void;
}

const Journal: React.FC<JournalProps> = ({ gameState, currentPlayer, otherPlayers, tab, onStartRumor, onPerformRitual }) => {
  const [rumorText, setRumorText] = useState('');
  // Helper to get player name by ID
  const getPlayerName = (playerId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown';
  };

  if (tab === 'Events') {
    // Events log tab
    return (
      <div className="text-sm">
        {gameState.log.map((entry, idx) => (
          <div key={idx} className="mb-1">- {entry}</div>
        ))}
      </div>
    );
  }

  if (tab === 'Rumors') {
    // Rumors tab with list of rumors and input to start a new rumor
    return (
      <div className="text-sm">
        <ul>
          {gameState.rumors.map(rumor => (
            <li key={rumor.id} className="mb-1">
              <strong>Rumor:</strong> "{rumor.content}" (Spread: {rumor.spread}) 
              {rumor.impact && <em> — Impact: {rumor.impact}</em>}
            </li>
          ))}
        </ul>
        {currentPlayer && (
          <div className="mt-2">
            <input 
              type="text" 
              value={rumorText} 
              onChange={(e) => setRumorText(e.target.value)} 
              placeholder="Start a rumor..." 
              className="w-2/3 px-1 py-0.5 text-black"
            />
            <button 
              className="ml-2 px-2 py-1 text-xs bg-purple-700 rounded"
              onClick={() => {
                if (rumorText.trim().length > 0) {
                  onStartRumor(rumorText.trim());
                  setRumorText('');
                }
              }}
            >
              Spread Rumor
            </button>
          </div>
        )}
      </div>
    );
  }

  if (tab === 'Ritual') {
    // Ritual quest progress tab
    const ritual = gameState.ritual;
    const canPerform = currentPlayer && ritual.active && ritual.currentStep < ritual.steps.length;
    let requirement = null;
    if (canPerform) {
      requirement = ritual.steps[ritual.currentStep].requirement;
    }
    return (
      <div className="text-sm">
        <div><strong>Ritual Quest:</strong> {ritual.name}</div>
        {ritual.steps.map((step, index) => (
          <div key={index}>
            [{step.done ? 'x' : ' '}] Step {index+1}: {step.description}
          </div>
        ))}
        {ritual.active && currentPlayer && requirement && (
          <button 
            className="mt-2 px-2 py-1 bg-indigo-700 rounded disabled:opacity-50"
            disabled={!currentPlayer.inventory.find(it => it.name === requirement.item && it.quantity >= requirement.quantity)}
            onClick={() => onPerformRitual()}
          >
            Perform Next Ritual Step
          </button>
        )}
        {!ritual.active && ritual.completedBy && (
          <div className="mt-2 text-green-400">
            Completed by {getPlayerName(ritual.completedBy)}.
          </div>
        )}
      </div>
    );
  }

  if (tab === 'Overview') {
    // Overview/Achievements tab: show winner and influence stats
    return (
      <div className="text-sm">
        {gameState.status.status === 'completed' && gameState.status.winner && (
          <div className="mb-2 text-yellow-300">
            Game Over: {getPlayerName(gameState.status.winner)} has ascended!
          </div>
        )}
        <div className="mb-1 font-semibold">Town Influence:</div>
        {gameState.players.map(player => (
          <div key={player.id} className="mb-1 ml-2">
            {player.name}: {Object.entries(player.influence).map(([town, val]) => `${town}(${val})`).join(', ')}
            {player.ascendancy && ' – Ascended'}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default Journal;
