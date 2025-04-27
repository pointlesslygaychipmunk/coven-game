import { useState } from "react";

import RuneGrid from "./RuneGrid";
import { Progress } from "@/components/ui/progress";

import type { BrewMove } from "@shared/types";

interface RuneCrushProps {
  seed: string;
  recipe: {
    id: string;
    targetScore: number;
    maxMoves: number;
  };
  /** fires when either the target score is reached or the move limit is hit */
  onComplete(score: number, moves: BrewMove[]): void;
}

/** Match-3 mini-game used inside Brew-Dialog (or standalone for testing) */
export default function RuneCrush({
  seed,
  recipe,
  onComplete,
}: RuneCrushProps) {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState<BrewMove[]>([]);

  const percent = Math.min((score / recipe.targetScore) * 100, 100);

  return (
    <div className="space-y-4">
      <RuneGrid
        seed={seed}
        onChange={(s, m) => {
          setScore(s);
          setMoves(m);
          if (s >= recipe.targetScore || m.length >= recipe.maxMoves) {
            onComplete(s, m);
          }
        }}
      />

      <Progress value={percent} />
      <p className="text-center text-xs text-muted-foreground">
        {score}/{recipe.targetScore} • {moves.length}/{recipe.maxMoves} moves
      </p>
    </div>
  );
}

export { type BrewMove as Move } from "../../../shared/src/types";