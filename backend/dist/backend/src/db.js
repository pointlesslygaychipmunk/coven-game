"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveState = exports.loadState = void 0;
// backend/src/db.ts
const path_1 = __importDefault(require("path"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3")); // assumes you've done `npm i better-sqlite3` and `npm i -D @types/better-sqlite3`
const db = new better_sqlite3_1.default(path_1.default.resolve(__dirname, "../game.db"));
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
function loadState() {
    // Tell TS that row is either `{ data: string }` or `undefined`
    const row = loadStmt.get();
    if (!row)
        return null;
    return JSON.parse(row.data);
}
exports.loadState = loadState;
function saveState(state) {
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
exports.saveState = saveState;
