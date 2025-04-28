/**
 * 🌑🌒🌓🌔🌕  Coven Game – unified HTTP + HTTPS server  🌖🌗🌘🌑
 * ─────────────────────────────────────────────────────────
 * • Serves the pre-built React bundle in  ../frontend/dist
 * • Exposes REST API under /api/*
 * • Runs plain-HTTP  on PORT        (default  8080)
 * • Runs TLS-HTTPS  on TLS_PORT     (default  8443)
 *   – expects   ./cert/privkey.pem  &  ./cert/fullchain.pem
 */

import fs   from "node:fs";
import path from "node:path";
import http from "node:http";
import https from "node:https";

import express      from "express";
import compression  from "compression";
import cors         from "cors";

import { gameState } from "./db";

/* —————————————————————————————————————————— */
/*  Paths & constants                                                    */
/* —————————————————————————————————————————— */

const ROOT           = path.resolve(__dirname, "../../");
const FRONTEND_DIST  = path.join(ROOT, "frontend/dist");
const INDEX_HTML     = path.join(FRONTEND_DIST, "index.html");

const PORT      = Number(process.env.PORT)      || 8080;
const TLS_PORT  = Number(process.env.TLS_PORT)  || 8443;
const CERT_DIR  = path.join(ROOT, "cert");                  // keep your .pem files here
const CERT_FILE = path.join(CERT_DIR, "fullchain.pem");
const KEY_FILE  = path.join(CERT_DIR, "privkey.pem");

/* —————————————————————————————————————————— */
/*  Express app                                                           */
/* —————————————————————————————————————————— */

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());

/* static files – React bundle */
app.use(express.static(FRONTEND_DIST));

/* API */
app.get("/api/state", (_req, res) => res.json(gameState));

/* fallback → index.html for SPA routes */
app.get("*", (_req, res) => {
  fs.createReadStream(INDEX_HTML).pipe(res);
});

/* —————————————————————————————————————————— */
/*  Launch servers                                                        */
/* —————————————————————————————————————————— */

http
  .createServer(app)
  .listen(PORT, () => {
    console.log(`🌙  HTTP  server listening  ➜  http://localhost:${PORT}`);
  });

/* spin up HTTPS only if key + cert exist */
try {
  const key  = fs.readFileSync(KEY_FILE);
  const cert = fs.readFileSync(CERT_FILE);

  https
    .createServer({ key, cert }, app)
    .listen(TLS_PORT, () => {
      console.log(`☾  HTTPS server listening ➜  https://localhost:${TLS_PORT}`);
    });

} catch (err) {
  console.warn(
    "⚠️  TLS key/cert not found – HTTPS disabled.\n" +
    `    Expected files:\n` +
    `    • ${KEY_FILE}\n` +
    `    • ${CERT_FILE}\n`
  );
}
