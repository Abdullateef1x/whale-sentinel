import { Request, Response } from "express";
import {
  sendTelegramAlert,
  sendDiscordAlert,
} from "../services/alert.service.js";
import { processSignal, signalStore } from "../services/signal.service.js";
import { tokenStats } from "../services/signal.service.js";
import { io } from "../index.js";

export const handleIncomingSignal = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const signal = await processSignal(data);

    signalStore.push(signal);

    // 🚀 WebSocket emit
    io.emit("new-signal", signal);

    // 🔔 ALERTS (NEW)
    await sendTelegramAlert(signal);
    await sendDiscordAlert(signal);

    console.log("📡 Signal + Alerts sent:", signal);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process signal" });
  }
};

export const getSignals = (req: Request, res: Response) => {
  res.json(signalStore);
};



export const getTokenAnalytics = (req: Request, res: Response) => {
  const rawToken = req.params.token;
  const token =
    typeof rawToken === "string"
      ? rawToken.toUpperCase()
      : Array.isArray(rawToken) && rawToken.length > 0
      ? rawToken[0].toUpperCase()
      : "";

  const data = tokenStats[token];

  if (!data) {
    return res.json({
      token,
      message: "No data yet",
    });
  }

  const total = data.buyVolume + data.sellVolume;

  const buyPressure = data.buyVolume / total || 0;
  const sellPressure = data.sellVolume / total || 0;

  // 🧠 Momentum score (simple but effective)
  const momentumScore =
    (buyPressure - sellPressure) * data.totalEvents;

  const bias =
    buyPressure > sellPressure ? "BULLISH" : "BEARISH";

  res.json({
    token,
    buyVolume: data.buyVolume,
    sellVolume: data.sellVolume,
    totalEvents: data.totalEvents,
    buyPressure,
    sellPressure,
    momentumScore: Number(momentumScore.toFixed(2)),
    bias,
    signals: data.signals.slice(-20),
  });
};