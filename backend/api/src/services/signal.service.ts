// src/services/signal.service.ts

// ================================
//  KNOWN VALID SWAP INSTRUCTION DISCRIMINATORS
// ================================

// Only process logs that contain real swap activity
const VALID_SWAP_KEYWORDS = [
  "Instruction: Swap",
  "Instruction: SwapV2",
  "Instruction: ExactSwap",
  "Instruction: Route",
  "Instruction: swap",
  "Program log: Instruction: swap",
];

export const isRealSwap = (logs: string[]): boolean => {
  return logs.some((log) =>
    VALID_SWAP_KEYWORDS.some((keyword) => log.includes(keyword))
  );
};

// ================================
//  TYPES
// ================================

type RawSignal = {
  type: "WHALE_BUY" | "WHALE_SELL";
  amount: number;
  token: string;
  signature: string;
  wallet: string;
  price: number;
};

type AggregatedData = {
  buyVolume: number;
  sellVolume: number;
  events: number;
  lastUpdated: number;
};

export type ProcessedSignal = {
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reason: string;
  token: string;
  signature: string;
  wallet: string;
  amount: number;
  price: number;
  timestamp: number;
  whaleGrade: "MEGA" | "LARGE" | "MID" | "SKIP"; // NEW
  isWhaleSignal: boolean;                          // NEW
};

type TokenStats = {
  token: string;
  buyVolume: number;
  sellVolume: number;
  totalEvents: number;
  signals: ProcessedSignal[];
};

export type DashboardStats = {
  solPrice: number;
  whalesDetected: number;
  bullishSignals: number;
  bearishSignals: number;
  latency: number;
};

export type TokenMetric = {
  token: string;
  buyPressure: number;
  sellPressure: number;
  momentum: number;
  smartMoney: number;
  signalQuality: number;
  whales: number;
};

export type WhaleActivity = {
  wallet: string;
  token: string;
  action: string;
  volume: string;
  pnl: string;
  status: "ACCUMULATING" | "DISTRIBUTING";
};

export type WalletProfile = {
  address: string;
  label: "SMART MONEY" | "WHALE" | "BOT" | "MOMENTUM";
  score: number;
  pnl: number;
  trades: number;
};

// ================================
//  WHALE GRADE THRESHOLDS (SOL)
// ================================

const WHALE_THRESHOLDS = {
  MEGA: 5000,   // $500k+ equivalent
  LARGE: 1000,  // $100k+
  MID: 200,     // $20k+ (minimum to emit)
  SKIP: 0,      // below threshold — ignored
} as const;

const getWhaleGrade = (amountSol: number): ProcessedSignal["whaleGrade"] => {
  if (amountSol >= WHALE_THRESHOLDS.MEGA) return "MEGA";
  if (amountSol >= WHALE_THRESHOLDS.LARGE) return "LARGE";
  if (amountSol >= WHALE_THRESHOLDS.MID) return "MID";
  return "SKIP";
};

// ================================
//  STORES
// ================================

export const dashboardStats: DashboardStats = {
  solPrice: 0,
  whalesDetected: 0,
  bullishSignals: 0,
  bearishSignals: 0,
  latency: 0,
};

export const tokenMetricsStore: Record<string, TokenMetric> = {};
export const walletProfiles: WalletProfile[] = [];
export const whaleActivities: WhaleActivity[] = [];
export const signalStore: ProcessedSignal[] = [];
export const tokenStats: Record<string, TokenStats> = {};

const tokenMap: Record<string, AggregatedData> = {};

const DECAY_TIME = 60 * 1000;

// ================================
//  CORE SIGNAL PROCESSOR
// ================================

export const processSignal = async (
  data: RawSignal
): Promise<ProcessedSignal | null> => {
  const { type, amount, token, signature, wallet, price } = data;

  // FILTER: skip anything below MID whale threshold
  const whaleGrade = getWhaleGrade(amount);
  if (whaleGrade === "SKIP") return null;

  // INIT token aggregation
  if (!tokenMap[token]) {
    tokenMap[token] = {
      buyVolume: 0,
      sellVolume: 0,
      events: 0,
      lastUpdated: Date.now(),
    };
  }

  if (!tokenStats[token]) {
    tokenStats[token] = {
      token,
      buyVolume: 0,
      sellVolume: 0,
      totalEvents: 0,
      signals: [],
    };
  }

  const tokenData = tokenMap[token];
  const now = Date.now();

  // DECAY RESET
  if (now - tokenData.lastUpdated > DECAY_TIME) {
    tokenData.buyVolume = 0;
    tokenData.sellVolume = 0;
    tokenData.events = 0;
  }

  tokenData.lastUpdated = now;

  // UPDATE VOLUMES
  if (type === "WHALE_BUY") {
    tokenData.buyVolume += amount;
    tokenStats[token].buyVolume += amount;
  }

  if (type === "WHALE_SELL") {
    tokenData.sellVolume += amount;
    tokenStats[token].sellVolume += amount;
  }

  tokenData.events += 1;
  tokenStats[token].totalEvents += 1;

  const totalVolume = tokenData.buyVolume + tokenData.sellVolume;
  const buyPressure = totalVolume > 0 ? tokenData.buyVolume / totalVolume : 0;
  const sellPressure = totalVolume > 0 ? tokenData.sellVolume / totalVolume : 0;

  // WHALE GRADE BOOSTS CONFIDENCE
  const gradeMultiplier =
    whaleGrade === "MEGA" ? 1.2 :
    whaleGrade === "LARGE" ? 1.1 :
    1.0;

  let signal: "BUY" | "SELL" | "HOLD" = "HOLD";
  let confidence = 0.5;
  let reason = "Whale activity below signal threshold";

  if (buyPressure > 0.65 && tokenData.events >= 2) {
    signal = "BUY";
    confidence = Math.min(buyPressure * gradeMultiplier, 1);
    reason =
      whaleGrade === "MEGA"
        ? "🐋 MEGA whale accumulation — extreme buy pressure"
        : whaleGrade === "LARGE"
        ? "Large whale accumulation detected"
        : "Whale buy pressure building";
  }

  if (sellPressure > 0.65 && tokenData.events >= 2) {
    signal = "SELL";
    confidence = Math.min(sellPressure * gradeMultiplier, 1);
    reason =
      whaleGrade === "MEGA"
        ? "🐋 MEGA whale dump — extreme sell pressure"
        : whaleGrade === "LARGE"
        ? "Large whale distribution detected"
        : "Whale sell pressure building";
  }

  const processedSignal: ProcessedSignal = {
    signal,
    confidence: Number(confidence.toFixed(2)),
    reason,
    token,
    signature,
    wallet,
    amount,
    price,
    timestamp: now,
    whaleGrade,
    isWhaleSignal: signal !== "HOLD",
  };

  // UPDATE STORES
  signalStore.unshift(processedSignal);
  if (signalStore.length > 200) signalStore.pop(); // cap at 200

  tokenStats[token].signals.unshift(processedSignal);

  if (processedSignal.isWhaleSignal) {
    dashboardStats.whalesDetected += 1;
    if (signal === "BUY") dashboardStats.bullishSignals += 1;
    if (signal === "SELL") dashboardStats.bearishSignals += 1;
  }

  return processedSignal;
};

// ================================
//  PORTFOLIO ENGINE
// ================================

export const computePortfolio = () => {
  const totalTrades = walletProfiles.reduce((acc, w) => acc + w.trades, 0);

  const avgPnl =
    walletProfiles.reduce((acc, w) => acc + w.pnl, 0) /
    (walletProfiles.length || 1);

  const winRate =
    (walletProfiles.filter((w) => w.pnl > 0).length /
      (walletProfiles.length || 1)) *
    100;

  return {
    balance: 100000 + avgPnl * 1000,
    pnl: Number(avgPnl.toFixed(2)),
    winRate: Number(winRate.toFixed(2)),
    totalTrades,
    trades: walletProfiles.map((w) => ({
      wallet: w.address,
      pnl: w.pnl,
      trades: w.trades,
      label: w.label,
    })),
  };
};