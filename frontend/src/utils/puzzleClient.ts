/**
 *  Client-side helpers for the Rune-Crush puzzle.
 *  Same pure logic as the server verifier, but bundled for the browser.
 *  Uses `seedrandom` so the board is identical on client & server.
 */
import seedrandom from 'seedrandom';
import type { Rune, BrewMove, Coord } from '../../../shared/types';

export const BOARD_W = 8;
export const BOARD_H = 6;
const RUNE_POOL: Rune[] = ['EARTH', 'WATER', 'FIRE', 'AIR', 'AETHER'];

export function genBoard(seed: string): Rune[][] {
  const rng = seedrandom(seed);
  const b: Rune[][] = Array.from({ length: BOARD_H }, () =>
    Array(BOARD_W).fill('EARTH') as Rune[]
  );
  let ok = false;
  while (!ok) {
    for (let y = 0; y < BOARD_H; y++)
      for (let x = 0; x < BOARD_W; x++)
        b[y][x] = RUNE_POOL[Math.floor(rng() * RUNE_POOL.length)];
    ok = !hasInitialMatch(b);
  }
  return b;
}

function hasInitialMatch(b: Rune[][]): boolean {
  for (let y = 0; y < BOARD_H; y++)
    for (let x = 0; x < BOARD_W; x++)
      if (matchAt(b, x, y).length >= 3) return true;
  return false;
}

/* ---------- move logic (mirror of server verifier) -------------------- */

export function applyMove(b: Rune[][], mv: BrewMove): boolean {
  const { from, to } = mv;
  if (!adjacent(from, to)) return false;
  swap(b, from, to);
  const cleared = resolveMatches(b);
  if (!cleared) {
    swap(b, from, to);               // illegal move → revert
    return false;
  }
  return true;
}

function adjacent(a: Coord, b: Coord) {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}
function swap(b: Rune[][], a: Coord, c: Coord) {
  [b[a.y][a.x], b[c.y][c.x]] = [b[c.y][c.x], b[a.y][a.x]];
}

function matchAt(b: Rune[][], x: number, y: number): Coord[] {
  const r = b[y][x];
  if (!r) return [];
  const h: Coord[] = [{ x, y }];
  for (let i = x - 1; i >= 0 && b[y][i] === r; i--) h.push({ x: i, y });
  for (let i = x + 1; i < BOARD_W && b[y][i] === r; i++) h.push({ x: i, y });
  const v: Coord[] = [{ x, y }];
  for (let j = y - 1; j >= 0 && b[j][x] === r; j--) v.push({ x, y: j });
  for (let j = y + 1; j < BOARD_H && b[j][x] === r; j++) v.push({ x, y: j });

  const out: Set<string> = new Set();
  if (h.length >= 3) h.forEach(c => out.add(`${c.x},${c.y}`));
  if (v.length >= 3) v.forEach(c => out.add(`${c.x},${c.y}`));
  return Array.from(out).map(s => {
    const [cx, cy] = s.split(',').map(Number);
    return { x: cx, y: cy };
  });
}

function resolveMatches(b: Rune[][]): boolean {
  const clear: Set<string> = new Set();
  for (let y = 0; y < BOARD_H; y++)
    for (let x = 0; x < BOARD_W; x++)
      matchAt(b, x, y).forEach(c => clear.add(`${c.x},${c.y}`));
  if (!clear.size) return false;

  clear.forEach(s => {
    const [x, y] = s.split(',').map(Number);
    b[y][x] = null as unknown as Rune;
  });

  for (let x = 0; x < BOARD_W; x++) {
    let write = BOARD_H - 1;
    for (let y = BOARD_H - 1; y >= 0; y--) {
      if (b[y][x] !== null) {
        b[write][x] = b[y][x];
        write--;
      }
    }
    const rng = Math.random;
    while (write >= 0) {
      b[write][x] = RUNE_POOL[Math.floor(rng() * RUNE_POOL.length)];
      write--;
    }
  }
  resolveMatches(b);    // cascade recursively
  return true;
}