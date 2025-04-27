import { Server } from "socket.io";
import { executeActions } from "./executeActions";
import { advanceTurn } from "./turnEngine";
import { createGameState } from "./createGameState";
import type { GameState, Action } from "../../shared/src/types";

export function setupPlayController(io: Server) {
  let state: GameState = createGameState();

  io.on("connection", (socket) => {
    // Send initial state
    socket.emit("state", state);

    socket.on("executeActions", ({ playerId, actions }: { playerId: string; actions: Action[] }) => {
      state = executeActions(state, playerId, actions);
      io.emit("state", state);
    });

    socket.on("advanceTurn", () => {
      state = advanceTurn(state);
      io.emit("state", state);
    });
  });
}