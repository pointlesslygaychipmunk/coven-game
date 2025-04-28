/* ────────────────────────────────────────────────────────────────
   backend/src/server.ts
   - Express app with dual HTTP + HTTPS listeners
   - Reads cert / key from ./certs or from environment variables
───────────────────────────────────────────────────────────────── */

import "dotenv/config";
import fs          from "fs";
import path        from "path";
import http        from "http";
import https       from "https";
import express     from "express";
import cors        from "cors";

import brewRouter  from "./routes/brewController";
import { gameState } from "./db";

/* ——————————————————————————————————————————————————————— */
/*  Express app setup                                          */
/* ——————————————————————————————————————————————————————— */

const app = express();

app.use(cors());
app.use(express.json());

/* REST endpoints */
app.get("/api/state", (_req, res) => res.json(gameState));
app.use("/api", brewRouter);

/* ——————————————————————————————————————————————————————— */
/*  Helper: create HTTPS server if certs are available         */
/* ——————————————————————————————————————————————————————— */

/** Returns an { server, protocol, port } triple */
function createHttpsServer(app: express.Express) {
  const certDir   = process.env.CERT_DIR ?? path.resolve(__dirname, "../certs");
  const certFile  = process.env.CERT_FILE ?? "fullchain.pem";
  const keyFile   = process.env.KEY_FILE  ?? "privkey.pem";
  const portHttps = Number(process.env.PORT_HTTPS ?? 443);

  const certPath = path.join(certDir, certFile);
  const keyPath  = path.join(certDir, keyFile);

  try {
    const creds = {
      cert: fs.readFileSync(certPath, "utf8"),
      key : fs.readFileSync(keyPath,  "utf8"),
    };
    const srv = https.createServer(creds, app);
    return { server: srv, protocol: "https", port: portHttps };
  } catch {
    /* no certs ⇒ return null and let caller ignore */
    return null;
  }
}

/* ——————————————————————————————————————————————————————— */
/*  Start servers                                              */
/* ——————————————————————————————————————————————————————— */

const portHttp  = Number(process.env.PORT_HTTP ?? 8080);
const httpSrv   = http.createServer(app).listen(portHttp, () =>
  console.log(`✓ HTTP  server listening on port ${portHttp}`)
);

const httpsInfo = createHttpsServer(app);
if (httpsInfo) {
  httpsInfo.server.listen(httpsInfo.port, () =>
    console.log(`✓ HTTPS server listening on port ${httpsInfo.port}`)
  );
} else {
  console.warn(
    "⚠︎  HTTPS disabled – certificate or key not found. " +
    "Set CERT_DIR / CERT_FILE / KEY_FILE env vars (or ./certs/*.pem) to enable."
  );
}

/* Export for tests / tooling */
export default app;
