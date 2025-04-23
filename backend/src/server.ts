import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// ✅ Apply CORS for frontend access
app.use(cors({
  origin: "https://coven-frontend.onrender.com",
}));

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

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});