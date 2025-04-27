import { cn } from "@ui/utils";
import { useState } from "react";
import classNames from "@ui/utils";
import type { BrewMove } from "@shared/types";
import RuneGrid from "./RuneGrid";

type Props = {
  /** ✨ NEW – id is required by callers (e.g. PotionPanel) */
  recipeId: string;
  seed: string;
  targetScore: number;
  maxMoves: number;
  /** fires once the puzzle is finished */
  onSubmit(moves: BrewMove[]): Promise<void>;
};

export default function RuneCrush({
  recipeId,
  seed,
  targetScore,
  maxMoves,
  onSubmit,
}: Props) {
  const [moves, setMoves] = useState<BrewMove[]>([]);
  const [score, setScore] = useState(0);

  return (
    <section
      aria-label={`Rune-Crush brewing puzzle for ${recipeId}`}
      className={classNames(
        "bg-stone-900 rounded-xl shadow-2xl ring-1 ring-stone-700/60",
        "w-[min(95vw,32rem)] p-6 grid gap-4"
      )}
    >
      <RuneGrid
        seed={seed}
        onChange={(s, m) => {
          setScore(s);
          setMoves(m);
          if (s >= targetScore || m.length >= maxMoves) onSubmit(m);
        }}
      />
      <progress
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={targetScore}
        value={score}
        className="w-full accent-emerald-400 h-2 rounded"
      />
      <p className="text-xs text-stone-300 text-center">
        {score}/{targetScore} • {moves.length}/{maxMoves} moves
      </p>
    </section>
  );
}