// backend/src/server.ts

import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import http from "http";
import https from "https";
import { Server as IOServer } from "socket.io";

import { setupPlayController } from "./playController";
import { executeActions }      from "./executeActions";
import { advanceTurn }         from "./turnEngine";
import { createGameState }     from "./createGameState";
import type { GameState, Action } from "../../shared/types";

const app = express();
app.use(cors());
app.use(express.json());

// — API Endpoints —

let state: GameState = createGameState();

app.get("/state", (_req, res) => {
  res.json(state);
});

app.post("/execute-actions", (req, res) => {
  const { playerId, actions } = req.body as { playerId: string; actions: Action[] };
  state = executeActions(state, playerId, actions);
  res.json(state);
});

app.post("/play-turn", (_req, res) => {
  state = advanceTurn(state);
  res.json(state);
});

// — Static Frontend —

const staticDir = path.join(__dirname, "../frontend/dist");
app.use(express.static(staticDir));
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

// — HTTPS + HTTP Redirect or HTTP Only —

// Path where win-acme dropped your PEM files:
const CERT_DIR = process.env.CERT_DIR || "C:/certs";
const keyPath  = path.join(CERT_DIR, "privkey.pem");
const crtPath  = path.join(CERT_DIR, "fullchain.pem");
const hasCerts = fs.existsSync(keyPath) && fs.existsSync(crtPath);

if (hasCerts) {
  // Read cert files
  const sslOptions = {
    key:  fs.readFileSync(keyPath),
    cert: fs.readFileSync(crtPath),
  };

  // HTTPS server + Socket.IO
  const httpsServer = https.createServer(sslOptions, app);
  const io = new IOServer(httpsServer);
  setupPlayController(io);

  httpsServer.listen(443, () => {
    console.log("🌝 HTTPS server listening on port 443");
  });

  // HTTP → HTTPS redirect
  http
    .createServer((req, res) => {
      const host = req.headers.host;
      res.writeHead(301, {
        Location: `https://${host}${req.url}`,
      });
      res.end();
    })
    .listen(80, () => {
      console.log("🌚  HTTP redirecting to HTTPS on port 80");
    });
} else {
  // No certs: fallback to HTTP only on PORT or 8080
  const httpServer = http.createServer(app);
  const io = new IOServer(httpServer);
  setupPlayController(io);

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
  httpServer.listen(PORT, () => {
    console.log(`🌙  HTTP server listening on port ${PORT}`);
  });
}