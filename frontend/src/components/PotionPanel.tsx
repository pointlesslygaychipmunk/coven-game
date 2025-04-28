// frontend/src/components/PotionPanel.tsx – Brewing interface and match-3 puzzle modal
import { useState } from 'react';
import type { Player, BrewMove, GameState } from '@shared/types';
import RuneCrush from '@/components/RuneCrush';  // puzzle component

interface PotionPanelProps {
  player: Player;
  onBrewComplete: (newState: GameState) => void;
}

// For simplicity, one recipe is available in this prototype:
const recipes = [{ id: 'moonwell_elixir', name: 'Moonwell Elixir', targetScore: 500, maxMoves: 25 }];

const PotionPanel: React.FC<PotionPanelProps> = ({ player, onBrewComplete }) => {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState('');
  const [recipe] = useState(recipes[0]);

  // Start brewing ritual
  function startBrewing() {
    setSeed(crypto.randomUUID());
    setOpen(true);
  }

  // Submit the brewing result to server
  async function submitBrew(moves: BrewMove[]) {
    try {
      const res = await fetch('/api/brew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-player-id': player.id },
        body: JSON.stringify({ recipeId: recipe.id, seed, moves }),
      });
      if (!res.ok) throw new Error('Brew submission failed');
      const newState: GameState = await res.json();
      setOpen(false);
      onBrewComplete(newState);
    } catch (err) {
      console.error('Brew error:', err);
      setOpen(false);
    }
  }

  return (
    <div className="p-4 bg-stone-900/80 rounded-xl">
      <h3 className="text-xl shimmer-text mb-2">🧪 Brewing: {recipe.name}</h3>
      <button onClick={startBrewing} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-sm">
        Begin Brew Ritual
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <RuneCrush
            recipeId={recipe.id}
            seed={seed}
            targetScore={recipe.targetScore}
            maxMoves={recipe.maxMoves}
            onSubmit={submitBrew}
          />
        </div>
      )}
    </div>
  );
};

export default PotionPanel;
