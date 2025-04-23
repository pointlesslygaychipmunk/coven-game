import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// ✅ ALLOW frontend domain to talk to backend
app.use(cors({ origin: "https://coven-frontend.onrender.com" }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "https://coven-frontend.onrender.com" },
});

// ✅ This must return JSON
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});