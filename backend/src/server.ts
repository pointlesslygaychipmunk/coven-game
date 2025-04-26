// backend/src/server.ts

import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import express from "express";
import cors from "cors";
import { Server as IOServer } from "socket.io";
import type { GameState, Action } from "../../shared/types";

import { setupPlayController } from "./playController";
import { executeActions }      from "./executeActions";
import { advanceTurn }         from "./turnEngine";
import { createGameState }     from "./createGameState";

const app = express();
app.use(cors());
app.use(express.json());

// --- In-memory state ----------------------------------------

let state: GameState = createGameState();

// --- API Endpoints ----------------------------------------

app.get("/state", (_req, res) => {
  res.json(state);
});

app.post("/execute-actions", (req, res) => {
  const { playerId, actions } = req.body as {
    playerId: string;
    actions: Action[];
  };
  state = executeActions(state, playerId, actions);
  res.json(state);
});

app.post("/play-turn", (_req, res) => {
  state = advanceTurn(state);
  res.json(state);
});

// --- Static front-end -------------------------------------

const staticDir = path.join(__dirname, "../../frontend/dist");
app.use(express.static(staticDir));
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

// --- Redirector (HTTP → HTTPS) ----------------------------

const httpServer = http.createServer((req, res) => {
  // preserve host and path
  const host = req.headers.host;
  res.writeHead(301, {
    Location: `https://${host}${req.url ?? ""}`,
  });
  res.end();
});

// --- HTTPS server w/ your Win-ACME certs -------------------

const CERT_DIR = process.env.CERT_DIR ||
  // edit your actual folder name here:
  "C:\certs";

const credentials = {
  key:  fs.readFileSync(path.join(CERT_DIR, "privateKey.pem")),
  cert: fs.readFileSync(path.join(CERT_DIR, "fullchain.pem")),
};

const httpsServer = https.createServer(credentials, app);

// --- Socket.IO on HTTPS -----------------------------------

const io = new IOServer(httpsServer);
setupPlayController(io);

// --- Launch both -----------------------------------------

httpServer.listen(80,  () =>
  console.log(`🌝 HTTP redirector listening on port 80`)
);
httpsServer.listen(443, () =>
  console.log(`🌙 HTTPS server listening on port 443`)
);