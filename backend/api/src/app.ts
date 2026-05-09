import express from "express";
import cors from "cors";
import signalRoutes from "./routes/signal.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import metricsRoutes from "./routes/metrics.routes";
import whaleRoutes from "./routes/whales.routes";
import walletRoutes from "./routes/wallet.routes";
import portfolioRoutes from "./routes/portfolio.routes";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/signals", signalRoutes);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use("/api/metrics", metricsRoutes);
app.use("/api/whales", whaleRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/portfolio", portfolioRoutes);


export default app;