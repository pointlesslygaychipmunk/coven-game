"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPlayController = void 0;
const executeActions_1 = require("./executeActions");
const turnEngine_1 = require("./turnEngine");
const createGameState_1 = require("./createGameState");
function setupPlayController(io) {
    let state = (0, createGameState_1.createGameState)();
    io.on("connection", (socket) => {
        // Send initial state
        socket.emit("state", state);
        socket.on("executeActions", ({ playerId, actions }) => {
            state = (0, executeActions_1.executeActions)(state, playerId, actions);
            io.emit("state", state);
        });
        socket.on("advanceTurn", () => {
            state = (0, turnEngine_1.advanceTurn)(state);
            io.emit("state", state);
        });
    });
}
exports.setupPlayController = setupPlayController;
