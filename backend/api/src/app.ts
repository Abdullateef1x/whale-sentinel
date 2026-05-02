import express from "express";
import cors from "cors";
import signalRoutes from "./routes/signal.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/signals", signalRoutes);

export default app;