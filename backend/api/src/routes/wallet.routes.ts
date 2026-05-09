import { Router } from "express";
import { walletProfiles } from "../services/signal.service";

const router = Router();

router.get("/", (req, res) => {
  res.json(walletProfiles);
});

export default router;