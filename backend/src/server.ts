import express from 'express';
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

// Setup
const app = express();
const HTTP_PORT = 80;
const HTTPS_PORT = 443;

// Calculate absolute paths
const projectRoot = path.join(__dirname, '..', '..'); // Go up from /backend/dist/ to /coven-game/
const frontendDist = path.join(projectRoot, 'frontend', 'dist');
const certsDir = path.join(projectRoot, 'backend', 'certs');

// Load SSL Certificates
let credentials: { key: Buffer; cert: Buffer } | null = null;
try {
  credentials = {
    key: fs.readFileSync(path.join(certsDir, 'privkey.pem')),
    cert: fs.readFileSync(path.join(certsDir, 'fullchain.pem')),
  };
  console.log('🌕🔮 SSL certificates loaded successfully.');
} catch (err) {
  console.warn('🌑⚠️ SSL certificates not found. Proceeding without HTTPS.');
}

// Serve static frontend files
app.use(express.static(frontendDist));

// Catch-all: serve index.html for any route (SPA handling)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Create HTTP server
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, () => {
  console.log(`🌗 HTTP server listening at http://localhost:${HTTP_PORT}`);
});

// Create HTTPS server if certs loaded
if (credentials) {
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`🌕 HTTPS server listening at https://localhost:${HTTPS_PORT}`);
  });
}

app.get('/api/state', (req, res) => {
  const dummyState = {
    players: [
      {
        id: "player1",
        garden: Array(64).fill({ crop: null, dead: false }),
        inventory: { mushroom: 2, flower: 1, herb: 0, fruit: 0 },
      }
    ],
  };
  
  res.json(dummyState);
});
