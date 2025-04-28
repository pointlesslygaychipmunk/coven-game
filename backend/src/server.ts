/* ────────────────────────────────────────────────────────────────
   backend/src/server.ts  🌙
   Express app with HTTP + optional HTTPS (auto-falls back)
───────────────────────────────────────────────────────────────── */

import "dotenv/config";
import fs          from "fs";
import path        from "path";
import http        from "http";
import https       from "https";
import express     from "express";
import cors        from "cors";

import brewRouter   from "./routes/brewController";
import { gameState } from "./db";

/* ——————————————————————————————————————————— */
/*  Express setup                                */
/* ——————————————————————————————————————————— */

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/state", (_req, res): void => {
  res.json(gameState);         // ← return type is void ✔
});

app.use("/api", brewRouter);

/* ——————————————————————————————————————————— */
/*  Try to spin up HTTPS if certs exist          */
/* ——————————————————————————————————————————— */

function mountHttps(app: express.Express) {
  const dir  = process.env.CERT_DIR  ?? path.resolve(__dirname, "../certs");
  const cert = process.env.CERT_FILE ?? "fullchain.pem";
  const key  = process.env.KEY_FILE  ?? "privkey.pem";
  const p    = Number(process.env.PORT_HTTPS ?? 443);

  try {
    const creds = {
      cert: fs.readFileSync(path.join(dir, cert), "utf8"),
      key:  fs.readFileSync(path.join(dir, key),  "utf8"),
    };
    https.createServer(creds, app).listen(p, () =>
      console.log(`🌙  HTTPS server listening on ${p}`)
    );
  } catch {
    console.warn("⚠︎  HTTPS disabled (cert/key not found)");
  }
}

/* ——————————————————————————————————————————— */
/*  Start servers                                */
/* ——————————————————————————————————————————— */

const pHttp = Number(process.env.PORT_HTTP ?? 8080);
http.createServer(app).listen(pHttp, () =>
  console.log(`🌙  HTTP  server listening on ${pHttp}`)
);

mountHttps(app);   // spins up HTTPS when possible

export default app;