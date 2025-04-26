"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const db_1 = require("./db");
const playController_1 = require("./playController");
const executeActions_1 = require("./executeActions");
const turnEngine_1 = require("./turnEngine");
const createGameState_1 = require("./createGameState");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// load or bootstrap
let state = (0, db_1.loadState)() ?? (0, createGameState_1.createGameState)();
// REST endpoints
app.get('/state', (_req, res) => {
    res.json(state);
});
app.post('/execute-actions', (req, res) => {
    const { playerId, actions } = req.body;
    state = (0, executeActions_1.executeActions)(state, playerId, actions);
    (0, db_1.saveState)(state);
    res.json(state);
});
app.post('/play-turn', (_req, res) => {
    state = (0, turnEngine_1.advanceTurn)(state);
    (0, db_1.saveState)(state);
    res.json(state);
});
// serve your static frontend
const staticDir = path_1.default.join(__dirname, '../frontend/dist');
app.use(express_1.default.static(staticDir));
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(staticDir, 'index.html'));
});
// socket.io
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
(0, playController_1.setupPlayController)(io);
const PORT = parseInt(process.env.PORT || '8080', 10);
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
