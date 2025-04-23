import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// ✅ Apply CORS for frontend access
app.use(cors({
  origin: "https://coven-frontend.onrender.com",
}));

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://coven-frontend.onrender.com",
  },
});

// ✅ Simple GET route to confirm backend is reachable
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// ✅ Placeholder POST endpoints
app.post("/plant", (req, res) => {
  const { type, index, gameState } = req.body;
  console.log("Plant request received:", { type, index });
  // TODO: implement logic
  res.json(gameState); // echo back for now
});

app.post("/harvest", (req, res) => {
  const { gameState } = req.body;
  console.log("Harvest request received");
  res.json(gameState);
});

app.post("/brew", (req, res) => {
  const { gameState } = req.body;
  console.log("Brew request received");
  res.json(gameState);
});

app.post("/fulfill", (req, res) => {
  const { card, gameState } = req.body;
  console.log("Fulfill request received:", card);
  res.json(gameState);
});

app.post("/plant-tree", (req, res) => {
  const { plotIndex, gameState } = req.body;
  console.log("Plant tree request received:", plotIndex);
  res.json(gameState);
});

app.post("/fell-tree", (req, res) => {
  const { index, gameState } = req.body;
  console.log("Fell tree request received:", index);
  res.json(gameState);
});

app.post("/buy", (req, res) => {
  const { gameState } = req.body;
  console.log("Buy request received");
  res.json(gameState);
});

app.post("/sell", (req, res) => {
  const { gameState } = req.body;
  console.log("Sell request received");
  res.json(gameState);
});

app.post("/upgrade", (req, res) => {
  const { gameState } = req.body;
  console.log("Upgrade request received");
  res.json(gameState);
});

app.post("/advance", (req, res) => {
  const { gameState } = req.body;
  console.log("Advance request received");
  res.json({ ...gameState, gameOver: false }); // placeholder
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});