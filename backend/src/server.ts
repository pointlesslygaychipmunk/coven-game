import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import cors from "cors";

const app = express();

// ✅ This enables CORS for HTTP routes like /ping
app.use(cors({
  origin: "https://coven-frontend.onrender.com", // Allow frontend
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));

const server = http.createServer(app);

// ✅ This enables CORS for WebSocket connections via socket.io
const io = new Server(server, {
  cors: {
    origin: "https://coven-frontend.onrender.com",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});

app.get("/", (req, res) => {
  res.send("Coven Game Backend is running.");
});

