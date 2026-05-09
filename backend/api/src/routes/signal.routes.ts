import { Router } from "express";
import { handleIncomingSignal } from "../controllers/signal.controller";

const router = Router();

router.post("/", handleIncomingSignal);


export default router;