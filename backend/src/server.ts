import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { setupWebSocket } from './websocket';

// Configuration
const HTTP_PORT = Number(process.env.HTTP_PORT) || 3000;
const HTTPS_PORT = Number(process.env.HTTPS_PORT) || 443;
const CERTS_DIR = process.env.CERTS_DIR || path.join(__dirname, 'certs');

const app = express();

// Load SSL certificates if available
let credentials: { key: Buffer; cert: Buffer } | null = null;
try {
  credentials = {
    key: fs.readFileSync(path.join(CERTS_DIR, 'privkey.pem')),
    cert: fs.readFileSync(path.join(CERTS_DIR, 'fullchain.pem')),
  };
  console.log('✅ SSL certificates loaded successfully.');
} catch (err) {
  console.warn('⚠️ SSL certificates not found. Proceeding without HTTPS.');
}

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Redirect HTTP to HTTPS if HTTPS is running
if (credentials) {
  app.use((req, res, next) => {
    if (req.protocol === 'http') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Create servers
const httpServer = http.createServer(app);
let httpsServer: https.Server | null = null;

if (credentials) {
  httpsServer = https.createServer(credentials, app);
}

// Attach WebSocket to the right server
if (httpsServer) {
  setupWebSocket(httpsServer);
} else {
  setupWebSocket(httpServer);
}

// Start servers
httpServer.listen(HTTP_PORT, () => {
  console.log(`🌙 HTTP server listening at http://localhost:${HTTP_PORT}`);
});

if (httpsServer) {
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`☾ HTTPS server listening at https://localhost:${HTTPS_PORT}`);
});
}
