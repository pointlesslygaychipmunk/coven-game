import express      from "express";
import cors         from "cors";
import brewRouter   from "./routes/brewController";
import { gameState } from "./db";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/state", (_, res) => res.json(gameState));
app.use("/api", brewRouter);

app.listen(5173, () => console.log("☾ Coven backend listening on :5173"));
