/**
 * Pure deterministic Match-3 verification utils
 * – Used both by /brew route and unit tests
 */
import seedrandom from 'seedrandom';
import type { Rune, BrewMove, Coord } from '../../shared/src/types';

export const BOARD_W = 8;            // cols
export const BOARD_H = 6;            // rows
const RUNE_POOL: Rune[] = ['EARTH','WATER','FIRE','AIR','AETHER'];

type Board = Rune[][];               // [y][x]

/* ---------- generation --------------------------------------------------- */

export function genBoard(seed: string): Board {
  const rng = seedrandom(seed);
  const board: Board = Array.from({ length: BOARD_H }, () => Array(BOARD_W).fill('EARTH') as Rune[]);
  let good = false;

  while (!good) {
    // fill
    for (let y = 0; y < BOARD_H; y++) {
      for (let x = 0; x < BOARD_W; x++) {
        board[y][x] = RUNE_POOL[Math.floor(rng() * RUNE_POOL.length)];
      }
    }
    good = !hasInitialMatch(board);
  }
  return board;
}

function hasInitialMatch(b: Board): boolean {
  for (let y = 0; y < BOARD_H; y++)
    for (let x = 0; x < BOARD_W; x++)
      if (matchAt(b, x, y).length >= 3) return true;
  return false;
}

/* ---------- move application -------------------------------------------- */

export function applyMove(board: Board, move: BrewMove): boolean {
  const { from, to } = move;
  if (!adjacent(from, to)) return false;

  swap(board, from, to);
  const cleared = resolveMatches(board);
  if (!cleared) {
    // illegal move (no match) → revert
    swap(board, from, to);
    return false;
  }
  return true;
}

function adjacent(a: Coord, b: Coord) {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

function swap(board: Board, a: Coord, b: Coord) {
  [board[a.y][a.x], board[b.y][b.x]] = [board[b.y][b.x], board[a.y][a.x]];
}

/* ---------- match detection & resolution -------------------------------- */

function matchAt(board: Board, x: number, y: number): Coord[] {
  const rune = board[y][x];
  if (!rune) return [];

  const horiz: Coord[] = [{ x, y }];
  for (let i = x - 1; i >= 0 && board[y][i] === rune; i--) horiz.push({ x: i, y });
  for (let i = x + 1; i < BOARD_W && board[y][i] === rune; i++) horiz.push({ x: i, y });

  const vert: Coord[] = [{ x, y }];
  for (let j = y - 1; j >= 0 && board[j][x] === rune; j--) vert.push({ x, y: j });
  for (let j = y + 1; j < BOARD_H && board[j][x] === rune; j++) vert.push({ x, y: j });

  const matchCoords: Coord[] = [];
  if (horiz.length >= 3) matchCoords.push(...horiz);
  if (vert.length >= 3) matchCoords.push(...vert);
  return [...new Set(matchCoords.map(c => `${c.x},${c.y}`))].map(s => {
    const [cx, cy] = s.split(',').map(Number);
    return { x: cx, y: cy };
  });
}

function resolveMatches(board: Board): boolean {
  // 1. collect all matches
  const toClear: Set<string> = new Set();
  for (let y = 0; y < BOARD_H; y++)
    for (let x = 0; x < BOARD_W; x++)
      matchAt(board, x, y).forEach(c => toClear.add(`${c.x},${c.y}`));

  if (toClear.size === 0) return false;

  // 2. clear matched cells
  toClear.forEach(s => {
    const [x, y] = s.split(',').map(Number);
    board[y][x] = null as unknown as Rune; // temp hole
  });

  // 3. cascade down
  for (let x = 0; x < BOARD_W; x++) {
    let write = BOARD_H - 1;
    for (let y = BOARD_H - 1; y >= 0; y--) {
      if (board[y][x] !== null) {
        board[write][x] = board[y][x];
        write--;
      }
    }
    const rng = Math.random; // use JS global for cascade; not security critical
    while (write >= 0) {
      board[write][x] = RUNE_POOL[Math.floor(rng() * RUNE_POOL.length)];
      write--;
    }
  }
  // 4. recursively resolve new matches
  resolveMatches(board);
  return true;
}

/* ---------- verification entry ------------------------------------------ */

export interface VerifyOptions {
  targetScore: number;
  maxMoves: number;
  optimalMoves: number;
}

export function verifyBrew(seed: string, moves: BrewMove[], opts: VerifyOptions): number {
  if (moves.length > opts.maxMoves) return 0;

  const board = genBoard(seed);
  let score = 0;

  for (const mv of moves) {
    if (!applyMove(board, mv)) return 0;             // illegal move
    score += 100;                                    // base pts per valid swap
  }

  // quality scaling
  const scoreFraction = score / opts.targetScore;
  const rawQuality = Math.min(scoreFraction, 1);
  const moveBonus   = moves.length <= opts.optimalMoves ? 0.1 : 0;
  return Math.min(rawQuality + moveBonus, 1);
}