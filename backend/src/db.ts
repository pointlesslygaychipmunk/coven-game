// backend/src/db.ts
import path from "path";
import Database from "better-sqlite3";   // assumes you've done `npm i better-sqlite3` and `npm i -D @types/better-sqlite3`
import type { GameState } from "../../shared/types";

const db = new Database(path.resolve(__dirname, "../game.db"));

// --- Ensure our table exists ---
db
  .prepare(`
    CREATE TABLE IF NOT EXISTS state (
      key       TEXT PRIMARY KEY,
      data      TEXT NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `)
  .run();

// --- Prepare our load statement (TS will infer it as a Statement<any, any>) ---
const loadStmt = db.prepare("SELECT data FROM state WHERE key = 'main';");

export function loadState(): GameState | null {
  // Tell TS that row is either `{ data: string }` or `undefined`
  const row = loadStmt.get() as { data: string } | undefined;
  if (!row) return null;
  return JSON.parse(row.data) as GameState;
}

export function saveState(state: GameState): void {
  const json = JSON.stringify(state);
  const now = Date.now();

  db
    .prepare(`
      INSERT INTO state (key, data, updatedAt)
      VALUES ('main', @data, @now)
      ON CONFLICT(key) DO UPDATE SET
        data      = excluded.data,
        updatedAt = excluded.updatedAt;
    `)
    .run({ data: json, now });
}