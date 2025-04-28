import Database from "better-sqlite3";
import createGameState from "./createGameState";

export const db = new Database("coven.db");
export const gameState = createGameState();
