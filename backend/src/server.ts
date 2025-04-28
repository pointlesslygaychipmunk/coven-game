import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import path from "path";
import stateRoutes from "./routes/state";

const app = express();

const HTTP_PORT = 80;
const HTTPS_PORT = 443;
const CERTS_DIR = path.join(__dirname, "..", "certs");

// Load SSL certificates
let credentials: { key: Buffer; cert: Buffer } | null = null;
try {
  credentials = {
    key: fs.readFileSync(path.join(CERTS_DIR, "privkey.pem")),
    cert: fs.readFileSync(path.join(CERTS_DIR, "fullchain.pem")),
  };
  console.log("🌕🔮 SSL certificates loaded successfully.");
} catch (err) {
  console.warn("🌑⚠️ SSL certificates not found. Proceeding without HTTPS.");
}

// Serve static frontend files
const frontendDist = path.join(__dirname, "..", "..", "frontend", "dist");
app.use(express.static(frontendDist));

// Attach API routes
app.use("/api", stateRoutes);

// Serve index.html for all other routes (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

// Create HTTP server
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, () => {
  console.log(`🌗 HTTP server listening on port ${HTTP_PORT}`);
});

// Create HTTPS server if certs are available
if (credentials) {
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`🌙 HTTPS server listening on port ${HTTPS_PORT}`);
  });
}