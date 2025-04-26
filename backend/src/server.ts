// backend/src/server.ts
import path from "path";
import express from "express";
import cors from "cors";
import http from "http";
import crypto from "crypto";
import { exec } from "child_process";
import dotenv from "dotenv";
import { setupPlayController } from "./playController";
import { executeActions }      from "./executeActions";
import { advanceTurn }         from "./turnEngine";
import { createGameState }     from "./createGameState";
import type { GameState, Action } from "../../shared/types";
import { Server as IOServer }  from "socket.io";

dotenv.config();
const SECRET = process.env.WEBHOOK_SECRET!;
if (!SECRET) throw new Error("WEBHOOK_SECRET missing in .env");

const app = express();
app.use(cors());

// --- WEBHOOK before JSON parser ---
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.header("x-hub-signature-256") || "";
    const hmac = crypto
      .createHmac("sha256", SECRET)
      .update(req.body as Buffer)
      .digest("hex");
    if (sig !== `sha256=${hmac}`) {
      console.warn("✋ invalid webhook signature", sig);
      return res.status(401).send("Invalid signature");
    }

    let payload: any;
    try {
      payload = JSON.parse((req.body as Buffer).toString());
    } catch {
      return res.status(400).send("Invalid JSON");
    }

    // only deploy on pushes to main
    if (payload.ref === "refs/heads/main") {
      console.log("🔔  Received push to main — deploying…");
      try {
        await run("git pull origin main",  { cwd: path.resolve(__dirname, "../..") });
        await run("npm install",           { cwd: path.resolve(__dirname, "../..", "backend") });
        await run("npm run build",         { cwd: path.resolve(__dirname, "../..", "backend") });
        await run("nssm restart CovenGame",{ cwd: undefined });
        console.log("✅  Deploy complete");
      } catch (err) {
        console.error("❌  Deploy failed", err);
      }
    }

    res.sendStatus(200);
  }
);

// now regular JSON body parser
app.use(express.json());

// —————————————————————————————————
// your existing API + static + socket.io…
let state: GameState = createGameState();
app.get("/state",      (_req, res) => res.json(state));
app.post("/execute-actions", (req, res) => { /*…*/ });
app.post("/play-turn", (_req, res) => { /*…*/ });

const staticDir = path.join(__dirname, "../frontend/dist");
app.use(express.static(staticDir));
app.get("*", (_req, res) => res.sendFile(path.join(staticDir, "index.html")));

const server = http.createServer(app);
const io     = new IOServer(server);
setupPlayController(io);

const PORT = process.env.PORT ? +process.env.PORT : 8080;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// —————————————————————————————————
// helper to shell out commands
function run(cmd: string, opts: { cwd?: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`> ${cmd}`);
    exec(cmd, { cwd: opts.cwd, windowsHide: true }, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return reject(err);
      }
      console.log(stdout);
      resolve();
    });
  });
}