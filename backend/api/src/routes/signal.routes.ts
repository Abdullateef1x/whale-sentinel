import { Router } from "express";
import { handleIncomingSignal, getSignals, getTokenAnalytics } from "../controllers/signal.controller.js";

const router = Router();

router.post("/", handleIncomingSignal);
router.get("/", getSignals);
router.get("/token/:token", getTokenAnalytics);

export default router;