/// <reference lib="es2020" />
import seedrandom from "seedrandom";
import type { Rune, BrewMove, Coord } from "@shared/types";

export const BOARD_W = 8;  // board width (columns)
export const BOARD_H = 6;  // board height (rows)

// Define the pool of runes that can appear on the board
const RUNE_POOL: Rune[] = ["EARTH", "WATER", "FIRE", "AIR", "AETHER"];

/** A board is a 2D array of Runes (or null placeholders). */
type Board = (Rune | null)[][];

/* Board generation: creates a random board with no initial matches */
export function genBoard(seed: string): Board {
  const rng = seedrandom(seed);
  const board: Board = Array.from({ length: BOARD_H }, () =>
    Array(BOARD_W).fill("EARTH") as Rune[]  // initial fill (will be randomized)
  );

  // Keep randomizing until no initial 3-match exists
  let valid = false;
  while (!valid) {
    // Fill the board with random runes
    for (let y = 0; y < BOARD_H; y++) {
      for (let x = 0; x < BOARD_W; x++) {
        board[y][x] = RUNE_POOL[Math.floor(rng() * RUNE_POOL.length)];
      }
    }
    valid = !hasInitialMatch(board);
  }
  return board;
}

function hasInitialMatch(board: Board): boolean {
  for (let y = 0; y < BOARD_H; y++) {
    for (let x = 0; x < BOARD_W; x++) {
      if (matchAt(board, x, y).length >= 3) {
        return true;
      }
    }
  }
  return false;
}

/* Apply a swap move to the board. Returns true if it produces a match. */
export function applyMove(board: Board, move: BrewMove): boolean {
  const { from, to } = move;
  if (!adjacent(from, to)) return false;

  swap(board, from, to);
  const matched = resolveMatches(board);
  if (!matched) {
    // Illegal move (no match) -> revert the swap
    swap(board, from, to);
    return false;
  }
  return true;
}

function adjacent(a: Coord, b: Coord): boolean {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

function swap(board: Board, a: Coord, b: Coord) {
  [board[a.y]![a.x]!, board[b.y]![b.x]!] = [board[b.y]![b.x]!, board[a.y]![a.x]!];
}

/* Find coordinates of any match (3 or more in a row) that includes the cell (x, y). */
function matchAt(board: Board, x: number, y: number): Coord[] {
  const rune = board[y]?.[x];
  if (!rune) return [];

  const horiz: Coord[] = [{ x, y }];
  for (let i = x - 1; i >= 0 && board[y]![i] === rune; i--) horiz.push({ x: i, y });
  for (let i = x + 1; i < BOARD_W && board[y]![i] === rune; i++) horiz.push({ x: i, y });

  const vert: Coord[] = [{ x, y }];
  for (let j = y - 1; j >= 0 && board[j]![x] === rune; j--) vert.push({ x, y: j });
  for (let j = y + 1; j < BOARD_H && board[j]![x] === rune; j++) vert.push({ x, y: j });

  // Combine horizontal and vertical matches (using a set to avoid duplicates)
  const matchCoords = new Set<string>();
  if (horiz.length >= 3) horiz.forEach(c => matchCoords.add(`${c.x},${c.y}`));
  if (vert.length >= 3) vert.forEach(c => matchCoords.add(`${c.x},${c.y}`));

  // Convert back to Coord objects
  return Array.from(matchCoords).map(str => {
    const [cx, cy] = str.split(",").map(Number);
    return { x: cx, y: cy };
  });
}

/* Clear all matches on the board, cascade pieces down, and fill in gaps. */
function resolveMatches(board: Board): boolean {
  const toClear: Set<string> = new Set();
  for (let y = 0; y < BOARD_H; y++) {
    for (let x = 0; x < BOARD_W; x++) {
      matchAt(board, x, y).forEach(c => toClear.add(`${c.x},${c.y}`));
    }
  }
  if (toClear.size === 0) return false;

  // 1. Clear matched cells (mark as null)
  toClear.forEach(coordStr => {
    const [x, y] = coordStr.split(",").map(Number);
    board[y]![x] = null;
  });

  // 2. Cascade down: let pieces above fall into cleared spots
  for (let x = 0; x < BOARD_W; x++) {
    let writeY = BOARD_H - 1;
    for (let y = BOARD_H - 1; y >= 0; y--) {
      if (board[y]![x] !== null) {
        board[writeY]![x] = board[y]![x];
        writeY--;
      }
    }
    // Fill remaining spots at top with new random runes
    const rng = Math.random;  // use default RNG for cascade
    while (writeY >= 0) {
      board[writeY]![x] = RUNE_POOL[Math.floor(rng() * RUNE_POOL.length)];
      writeY--;
    }
  }

  // 3. Recursively resolve any new matches created by the cascade
  resolveMatches(board);
  return true;
}

/**
 * Verify a brewing move sequence. Returns a quality score [0,1] or 0 if invalid sequence.
 */
interface VerifyOptions {
  targetScore: number;
  maxMoves: number;
  optimalMoves: number;
}

export function verifyBrew(seed: string, moves: BrewMove[], opts: VerifyOptions): number {
  if (moves.length > opts.maxMoves) return 0;

  const board = genBoard(seed);
  let score = 0;
  for (const mv of moves) {
    if (!applyMove(board, mv)) {
      return 0;  // illegal move encountered
    }
    score += 100;  // base points per successful swap (example scoring)
  }

  // Calculate quality as fraction of targetScore (capped at 1.0), plus bonus for optimal moves
  const scoreFraction = score / opts.targetScore;
  const rawQuality   = Math.min(scoreFraction, 1);
  const moveBonus    = moves.length <= opts.optimalMoves ? 0.1 : 0;
  return Math.min(rawQuality + moveBonus, 1);
}
