/* ──────────────────────────────────────────────────────────────
   backend/src/server.ts  •  unified HTTP + HTTPS express server
   🌑🌒🌓🌔🌕  (moon-powered, as requested)
   ────────────────────────────────────────────────────────────── */

   import fs            from "node:fs";
   import path          from "node:path";
   import http          from "node:http";
   import https         from "node:https";
   import express, {
     type Request,
     type Response,
   }                    from "express";
   import compression   from "compression";
   import cors          from "cors";
   import morgan        from "morgan";
   
   import { gameState } from "./db";
   import "dotenv/config";
   
   /* ── constants ─────────────────────────────────────────────── */
   const FRONTEND_DIR = path.resolve(__dirname, "../../frontend/dist");
   const HTTP_PORT    = Number(process.env.PORT)      || 8080;
   const HTTPS_PORT   = Number(process.env.HTTPSPORT) || 8443;
   
   const CERT_DIR     = process.env.CERT_DIR
                      ?? path.resolve(__dirname, "../cert");
   const KEY_PATH     = path.join(CERT_DIR, "privkey.pem");
   const CERT_PATH    = path.join(CERT_DIR, "fullchain.pem");
   
   /* ── express app ───────────────────────────────────────────── */
   const app = express();
   
   app.use(cors());
   app.use(compression());
   app.use(express.json());
   app.use(morgan("tiny"));
   
   /* API – current game state */
   app.get("/api/state", (_req: Request, res: Response) => {
     res.json(gameState);
   });
   
   /* static SPA bundle */
   app.use(express.static(FRONTEND_DIR));
   app.get("*", (_req, res) => {
     res.sendFile(path.join(FRONTEND_DIR, "index.html"));
   });
   
   /* ── HTTP server (always) ──────────────────────────────────── */
   http.createServer(app).listen(HTTP_PORT, () => {
     console.log(`🌙  HTTP server listening on http://localhost:${HTTP_PORT}`);
   });
   
   /* ── HTTPS server (only if certs exist) ─────────────────────── */
   if (fs.existsSync(KEY_PATH) && fs.existsSync(CERT_PATH)) {
     const creds = {
       key : fs.readFileSync(KEY_PATH,  "utf8"),
       cert: fs.readFileSync(CERT_PATH, "utf8"),
     };
   
     https.createServer(creds, app).listen(HTTPS_PORT, () => {
       console.log(`☾  HTTPS server listening on https://localhost:${HTTPS_PORT}`);
     });
   } else {
     console.warn("🌚  HTTPS disabled – certificate files not found");
   }
   