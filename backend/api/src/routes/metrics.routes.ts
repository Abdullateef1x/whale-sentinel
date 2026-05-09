import { Router } from "express";
import { tokenMetricsStore } from "../services/signal.service";

const router = Router();

router.get("/:token", (req, res) => {
  const token =
    req.params.token.toUpperCase();

  const metrics =
    tokenMetricsStore[token];

  if (!metrics) {
    return res.json({
      message: "No metrics yet",
    });
  }

  res.json(metrics);
});

export default router;