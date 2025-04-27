import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@ui/dialog";
import { Progress } from "@ui/progress";
import RuneGrid from "./RuneGrid";
import type { BrewMove } from "@shared/types";

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

  return (
    <Dialog open={open} onOpenChange={(value: boolean) => !value && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Brew – {recipe.id}</DialogTitle>
        </DialogHeader>

        <RuneGrid
          seed={seed}
          onChange={(s, m) => {
            setScore(s);
            setMoves(m);
            if (s >= recipe.targetScore || m.length >= recipe.maxMoves) onSubmit(m);
          }}
        />

        <Progress value={(score / recipe.targetScore) * 100} className="mt-4" />
        <p className="text-xs text-center mt-1">
          {score}/{recipe.targetScore} • {moves.length}/{recipe.maxMoves} moves
        </p>

        <DialogFooter>
          <button
            onClick={onClose}
            className="rounded bg-stone-700 px-4 py-1.5 text-sm hover:bg-stone-600"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}