import { Router } from "express";

const router = Router();

router.get("/state", (req, res) => {
  const crops = [null, "mushroom", "flower", "herb", "fruit"];

  const garden = Array(64).fill(null).map(() => ({
    crop: Math.random() < 0.2 ? crops[Math.floor(Math.random() * crops.length)] : null,
    dead: false,
  }));

  res.json({
    players: [
      {
        id: "player1",
        garden,
        inventory: { mushroom: 3, flower: 2, herb: 1, fruit: 0 },
      }
    ],
  });
});

export default router;
