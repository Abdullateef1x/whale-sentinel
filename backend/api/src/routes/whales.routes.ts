import { Router } from "express";
import { whaleActivities } from "../services/signal.service";

const router = Router();

router.get("/", (req, res) => {
  res.json(whaleActivities);
});

export default router;