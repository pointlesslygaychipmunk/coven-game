import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import createGameState from "./createGameState";
import brewRouter from "./routes/brewController";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory game state (could connect to database if needed)
let gameState = createGameState();

// REST API routes
app.use("/api/brew", brewRouter);
// ... (other routes for game actions, market, etc.)

// Example endpoint to get current game state
app.get("/api/state", (_req, res) => {
  res.json(gameState);
});

// WebSocket server for real-time updates (if needed)
const httpServer = createServer(app);
const io = new Server(httpServer);
io.on("connection", (socket) => {
  console.log("🌑 New WebSocket connection.");
  // Broadcast initial state or handle subscriptions...
  socket.emit("state:init", gameState);

  socket.on("disconnect", () => {
    console.log("❌ WebSocket disconnected.");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
