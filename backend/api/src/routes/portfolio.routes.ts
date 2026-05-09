import { Router } from "express";
import { computePortfolio } from "../services/signal.service";

const router = Router();

router.get("/", (req, res) => {
  const portfolio = computePortfolio();

  return res.json({
    success: true,
    data: portfolio,
  });
});

export default router;