import { Server as WebSocketServer } from 'ws';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';

export function setupWebSocket(server: HttpServer | HttpsServer) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('🌑 New WebSocket connection established.');

    ws.on('message', (message) => {
      console.log(`📩 Received message: ${message}`);
      // Handle incoming messages here
    });

    ws.on('close', () => {
      console.log('❌ WebSocket connection closed.');
    });

    // Example: Send a welcome message
    ws.send('🌝 Welcome to the WebSocket server!');
  });
}
