import { useState } from "react";
import RuneCrush from "@/components/RuneCrush";
import type { BrewMove, Player } from "@shared/types";

interface PotionPanelProps {
  player: Player;
  onBrew: (recipeId: string) => void;
}

const recipes = [{ id: "moonwell_elixir", name: "Moonwell Elixir" }];

export default function PotionPanel({ player, onBrew }: PotionPanelProps) {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState("");
  const [recipe] = useState(recipes[0]);

  function startPuzzle() {
    setSeed(crypto.randomUUID());
    setOpen(true);
  }

  async function submit(moves: BrewMove[]) {
    await fetch("/api/brew", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-player-id": player.id },
      body: JSON.stringify({ recipeId: recipe.id, seed, moves }),
    });
    setOpen(false);
    onBrew(recipe.id);
  }

  return (
    <div className="p-4 bg-stone-800/60 rounded">
      <h3 className="text-lg mb-2">{recipe.name}</h3>
      <button onClick={startPuzzle} className="px-3 py-1 bg-emerald-500 rounded">
        Brew
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center">
          <RuneCrush
            recipeId={recipe.id}
            seed={seed}
            targetScore={500}
            maxMoves={25}
            onSubmit={submit}
          />
        </div>
      )}
    </div>
  );
}