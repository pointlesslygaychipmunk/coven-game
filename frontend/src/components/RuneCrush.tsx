import React, { useState, useEffect } from 'react';
import type { Rune, BrewMove } from '../../../shared/types';
import { BOARD_W, BOARD_H, genBoard, applyMove } from '../utils/puzzleClient';

interface Props {
  recipeId: string;
  seed: string;
  targetScore: number;
  maxMoves: number;
  onSubmit: (moves: BrewMove[]) => void;
}

export const RuneCrush: React.FC<Props> = ({
  recipeId, seed, targetScore, maxMoves, onSubmit
}) => {
  const [board, setBoard] = useState<Rune[][]>(() => genBoard(seed));
  const [moves, setMoves] = useState<BrewMove[]>([]);
  const [score, setScore] = useState(0);

  /** handle swap */
  const trySwap = (from: {x:number,y:number}, to:{x:number,y:number}) => {
    const copy = board.map(r => [...r]) as Rune[][];
    const move: BrewMove = { from, to };
    if (!applyMove(copy, move)) return;           // invalid move
    setBoard(copy);
    setMoves(m => [...m, move]);
    setScore(s => s + 100);
  };

  useEffect(() => {
    if (score >= targetScore || moves.length >= maxMoves) {
      onSubmit(moves);
    }
  }, [score, moves]);

  /* --- render ----------------------------------------------------------- */
  return (
    <div className="flex flex-col items-center">
      <div className="grid gap-1"
           style={{gridTemplateColumns:`repeat(${BOARD_W},2.5rem)`}}>
        {board.flatMap((row, y) =>
          row.map((rune, x) => (
            <div key={`${x}-${y}`}
                 className="w-10 h-10 flex items-center justify-center
                            rounded bg-emerald-200 cursor-pointer select-none"
                 onClick={() => {/* handle selection state here */}}>
              <span className="text-xs">{rune[0]}</span>
            </div>
          ))
        )}
      </div>
      <div className="mt-2 text-sm">
        Score {score}/{targetScore} &nbsp;·&nbsp; Moves {moves.length}/{maxMoves}
      </div>
    </div>
  );
};