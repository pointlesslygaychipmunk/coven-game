// src/components/BrewDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@ui/dialog';
import { Progress } from '@ui/progress';
import { useState } from 'react';
import RuneGrid from './RuneGrid';
import type { BrewMove } from '@shared/types';

interface Props {
  open: boolean;
  seed: string;
  recipe: { id: string; targetScore: number; maxMoves: number };
  onClose(): void;
  onSubmit(moves: BrewMove[]): void;
}

export default function BrewDialog({
  open,
  seed,
  recipe,
  onClose,
  onSubmit,
}: Props) {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState<BrewMove[]>([]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{`Brew – ${recipe.id}`}</DialogTitle>
        </DialogHeader>

        <RuneGrid
          seed={seed}
          onChange={(s: number, m: BrewMove[]) => {
            setScore(s);
            setMoves(m);
            if (s >= recipe.targetScore || m.length >= recipe.maxMoves) {
              onSubmit(m);
            }
          }}
        />

        <DialogFooter>
          <Progress value={(score / recipe.targetScore) * 100} className="mt-4" />
          <p className="text-xs text-center mt-1">
            {score}/{recipe.targetScore} • {moves.length}/{recipe.maxMoves} moves
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}