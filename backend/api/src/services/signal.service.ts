type RawSignal = {
  type: "WHALE_BUY" | "WHALE_SELL";
  amount: number;
  token: string;
};

type AggregatedData = {
  buyVolume: number;
  sellVolume: number;
  events: number;
  lastUpdated: number;
};

type ProcessedSignal = {
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reason: string;
  token: string;
  timestamp: number;
};
type TokenStats = {
  token: string;
  buyVolume: number;
  sellVolume: number;
  totalEvents: number;
  signals: any[];
};

export const signalStore: ProcessedSignal[] = [];

const tokenMap: Record<string, AggregatedData> = {};

const DECAY_TIME = 60 * 1000; // 1 minute


export const tokenStats: Record<string, TokenStats> = {};



export const processSignal = async (
  data: RawSignal
): Promise<ProcessedSignal> => {
  const { type, amount, token } = data;

  if (!tokenMap[token]) {
    tokenMap[token] = {
      buyVolume: 0,
      sellVolume: 0,
      events: 0,
      lastUpdated: Date.now(),
    };
  }

  const tokenData = tokenMap[token];

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

  // 🔥 Update state
  if (type === "WHALE_BUY") {
    tokenData.buyVolume += amount;
  }

  if (type === "WHALE_SELL") {
    tokenData.sellVolume += amount;
  }

  stats.totalEvents += 1;
stats.signals.push({
  signal: "HOLD", // or use the actual signal variable if available
  confidence: 0.5, // or use the actual confidence variable if available
  reason: "Neutral market", // or use the actual reason variable if available
  token,
  timestamp: Date.now(),
  raw: data,
});

  tokenData.events += 1;
  tokenData.lastUpdated = Date.now();

  // 🧠 Calculate pressure
  const totalVolume = tokenData.buyVolume + tokenData.sellVolume;

  const buyPressure = tokenData.buyVolume / totalVolume || 0;
  const sellPressure = tokenData.sellVolume / totalVolume || 0;

  // 🎯 Determine signal
  let signal: "BUY" | "SELL" | "HOLD" = "HOLD";
  let confidence = 0.5;
  let reason = "Neutral market";

  if (buyPressure > 0.7 && tokenData.events >= 3) {
    signal = "BUY";
    confidence = buyPressure;
    reason = "Strong whale accumulation across multiple transactions";
  }

  if (sellPressure > 0.7 && tokenData.events >= 3) {
    signal = "SELL";
    confidence = sellPressure;
    reason = "Heavy whale sell pressure detected";
  }

  const now = Date.now();

if (now - tokenData.lastUpdated > DECAY_TIME) {
  tokenData.buyVolume = 0;
  tokenData.sellVolume = 0;
  tokenData.events = 0;
}


const weight = amount / 10_000_000_000;

tokenData.buyVolume += weight * amount;
  return {
    signal,
    confidence: Number(confidence.toFixed(2)),
    reason,
    token,
    timestamp: Date.now(),
  };
};