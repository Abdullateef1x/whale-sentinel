import { Router } from "express";

import { dashboardStats }
from "../services/signal.service";

const router = Router();

router.get("/", (req, res) => {
  res.json(dashboardStats);
});

export default router;