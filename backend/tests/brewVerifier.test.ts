import { verifyBrew, genBoard } from '../brewVerifier';
import type { BrewMove } from '../shared/types';

const opts = { targetScore: 300, maxMoves: 10, optimalMoves: 5 };

test('legal move sequence verifies', () => {
  const seed  = 'test-seed';
  const board = genBoard(seed);

  // swap (0,0)↔(1,0) until match (brute search for demo)
  const moves: BrewMove[] = [];
  outer: for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length - 1; x++) {
      moves.push({ from: { x, y }, to: { x: x + 1, y } });
      break outer;
    }
  }
  const q = verifyBrew(seed, moves, opts);
  expect(q).toBeGreaterThan(0);
});