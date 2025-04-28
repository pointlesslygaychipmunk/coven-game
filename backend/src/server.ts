import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';

const app = express();
const HTTP_PORT = 80;
const HTTPS_PORT = 443;
const CERTS_DIR = path.join(__dirname, 'certs');

let credentials: { key: Buffer; cert: Buffer } | null = null;
try {
  credentials = {
    key: fs.readFileSync(path.join(CERTS_DIR, 'privkey.pem')),
    cert: fs.readFileSync(path.join(CERTS_DIR, 'fullchain.pem')),
  };
  console.log('🌕🔮 SSL certificates loaded successfully.');
} catch (err) {
  console.warn('🌑⚠️ SSL certificates not found. HTTPS will not be available.');
}

// Serve frontend
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Redirect HTTP ➔ HTTPS if SSL is available
if (credentials) {
  app.use((req, res, next) => {
    if (req.protocol === 'http') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Create HTTP server
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, () => {
  console.log(`☾ HTTP server listening at http://localhost:${HTTP_PORT}`);
});

// Create HTTPS server
if (credentials) {
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`🌙 HTTPS server listening at https://localhost:${HTTPS_PORT}`);
  });
}