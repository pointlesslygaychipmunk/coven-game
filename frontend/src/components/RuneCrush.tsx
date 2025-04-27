
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import RuneGrid from "./RuneGrid";
import type { BrewMove } from "../../../shared/src/types";

interface Props {
  open: boolean;
  seed: string;
  recipe: { id: string; targetScore: number; maxMoves: number };
  onClose(): void;
  onSubmit(moves: BrewMove[]): void;
}

export default function BrewDialog({ open, seed, recipe, onClose, onSubmit }: Props) {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState<BrewMove[]>([]);

  const progress = Math.min(100, (score / recipe.targetScore) * 100);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogHeader>Brew – {recipe.id}</DialogHeader>
      <DialogContent className="max-w-[90vw] sm:max-w-lg space-y-4">
        <RuneGrid
          seed={seed}
          onChange={(s, m) => {
            setScore(s);
            setMoves(m);
            if (s >= recipe.targetScore || m.length >= recipe.maxMoves) onSubmit(m);
          }}
        />
        <Progress value={progress} />
        <p className="text-xs text-center">
          {score}/{recipe.targetScore} • {moves.length}/{recipe.maxMoves} moves
        </p>
      </DialogContent>
      <DialogFooter>
        <button
          className="btn btn-primary w-full"
          onClick={() => onSubmit(moves)}
          disabled={moves.length === 0}
        >
          Brew
        </button>
      </DialogFooter>
    </Dialog>
  );
}
