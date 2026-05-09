import { Request, Response } from "express";

import {
  processSignal,
  signalStore,
  tokenStats,
  walletProfiles,
  whaleActivities,
  tokenMetricsStore,
  dashboardStats,
  WhaleActivity,
} from "../services/signal.service";

import {
  sendTelegramAlert,
  sendDiscordAlert,
} from "../services/alert.service";

import { getIO } from "../socket";

// 🧠 simple in-memory dedupe (prevents Solana spam duplicates)
const seenSignals = new Set<string>();

const isDuplicate = (sig?: string | null) => {
  if (!sig) return false;
  if (seenSignals.has(sig)) return true;

  seenSignals.add(sig);

  setTimeout(() => {
    seenSignals.delete(sig);
  }, 60_000);

  return false;
};

export const handleIncomingSignal = async (
  req: Request,
  res: Response
) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({ error: "Missing signal data" });
    }

    const io = getIO();

    // =========================
    // PROCESS SIGNAL
    // =========================
    const signal = await processSignal(data);

    // Drop sub-threshold signals (below MID whale grade)
    if (!signal) {
      return res.json({ success: true, skipped: true, reason: "below_threshold" });
    }

    // Prevent duplicate RPC spam
    if (isDuplicate(signal.signature)) {
      return res.json({ success: true, skipped: true, reason: "duplicate" });
    }

    const bullish = signal.signal === "BUY";

    // =========================
    // SAFE WALLET NORMALIZATION
    // =========================
    const walletAddress =
      signal.wallet && signal.wallet.length > 0
        ? signal.wallet.slice(0, 6) + "..."
        : `anon_${signal.token}_${Date.now()}`;

    // =========================
    // WALLET ENGINE
    // =========================
    let wallet = walletProfiles.find((w) => w.address === walletAddress);

    if (!wallet) {
      wallet = {
        address: walletAddress,
        label: "WHALE",
        score: 70,
        pnl: 0,
        trades: 0,
      };

      walletProfiles.push(wallet);
    }

    wallet.trades += 1;

    if (bullish) {
      wallet.score += 2;
      wallet.pnl += 1.2;
    } else {
      wallet.score -= 1;
      wallet.pnl -= 0.6;
    }

    wallet.score = Math.max(0, Math.min(100, wallet.score));

    if (wallet.score >= 90) wallet.label = "SMART MONEY";
    else if (wallet.score >= 75) wallet.label = "WHALE";
    else if (wallet.score >= 55) wallet.label = "MOMENTUM";
    else wallet.label = "BOT";

    io.emit("wallet-update", walletProfiles);

    // =========================
    // WHALE ACTIVITY
    // =========================
    const whale: WhaleActivity = {
      wallet: walletAddress,
      token: signal.token,
      action: bullish ? "Accumulating" : "Distributing",
      volume: `$${((signal.amount ?? 0) / 1_000_000).toFixed(2)}M`,
      pnl: bullish
        ? `+${(signal.confidence * 100).toFixed(1)}%`
        : `-${(signal.confidence * 100).toFixed(1)}%`,
      status: bullish ? "ACCUMULATING" : "DISTRIBUTING",
    };

    whaleActivities.unshift(whale);
    if (whaleActivities.length > 50) whaleActivities.pop();

    io.emit("whale-update", whaleActivities);

    // =========================
    // TOKEN METRICS
    // =========================
    const token = signal.token.toUpperCase();

    if (!tokenMetricsStore[token]) {
      tokenMetricsStore[token] = {
        token,
        buyPressure: 50,
        sellPressure: 50,
        momentum: 50,
        smartMoney: 50,
        signalQuality: 50,
        whales: 0,
      };
    }

    const metrics = tokenMetricsStore[token];

    // Grade multiplier — MEGA whales move metrics harder
    const gradeBoost =
      signal.whaleGrade === "MEGA" ? 2 :
      signal.whaleGrade === "LARGE" ? 1.5 :
      1;

    if (bullish) {
      metrics.buyPressure  = Math.min(100, metrics.buyPressure  + 4 * gradeBoost);
      metrics.sellPressure = Math.max(0,   metrics.sellPressure - 4 * gradeBoost);
      metrics.momentum     = Math.min(100, metrics.momentum     + 5 * gradeBoost);
      metrics.smartMoney   = Math.min(100, metrics.smartMoney   + 3 * gradeBoost);
    } else {
      metrics.buyPressure  = Math.max(0,   metrics.buyPressure  - 4 * gradeBoost);
      metrics.sellPressure = Math.min(100, metrics.sellPressure + 4 * gradeBoost);
      metrics.momentum     = Math.max(0,   metrics.momentum     - 5 * gradeBoost);
      metrics.smartMoney   = Math.max(0,   metrics.smartMoney   - 3 * gradeBoost);
    }

    metrics.signalQuality = Math.floor(signal.confidence * 100);
    metrics.whales = whaleActivities.filter((w) => w.token === token).length;

    io.emit("metrics-update", metrics);

    // =========================
    // DASHBOARD STATS
    // =========================
    dashboardStats.whalesDetected = whaleActivities.length;

    if (bullish) dashboardStats.bullishSignals += 1;
    else dashboardStats.bearishSignals += 1;

    dashboardStats.latency = Number(
      ((Date.now() - signal.timestamp) / 1000).toFixed(2)
    );

    dashboardStats.solPrice =
      Number(signal.price) || dashboardStats.solPrice;

    io.emit("dashboard-update", dashboardStats);

    // =========================
    // TOKEN STATS
    // =========================
    if (!tokenStats[token]) {
      tokenStats[token] = {
        token,
        buyVolume: 0,
        sellVolume: 0,
        totalEvents: 0,
        signals: [],
      };
    }

    const stats = tokenStats[token];

    stats.totalEvents += 1;
    stats.signals.unshift(signal);
    if (stats.signals.length > 100) stats.signals.pop();

    if (bullish) {
      stats.buyVolume += signal.amount ?? 0;
    } else {
      stats.sellVolume += signal.amount ?? 0;
    }

    signalStore.unshift(signal);
    if (signalStore.length > 500) signalStore.pop();

    // =========================
    // REALTIME EVENTS
    // =========================
    io.emit("new-signal", signal);
    io.emit("token-update", { token, stats });

    // =========================
    // ALERTS — only on real whale signals
    // =========================
    if (signal.isWhaleSignal) {
      await sendTelegramAlert(signal);
      await sendDiscordAlert(signal);
    }

    console.log(`📡 SIGNAL [${signal.whaleGrade}] ${signal.signal} — ${signal.token} (${(signal.confidence * 100).toFixed(0)}%)`);

    return res.json({ success: true, signal });

  } catch (error) {
    console.error("Signal error:", error);
    return res.status(500).json({ error: "Failed to process signal" });
  }
};