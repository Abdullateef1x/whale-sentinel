export type Signal = {
  isWhaleSignal: any;
  whaleGrade: any;
  amount: any;
  signature: Key | null | undefined;
  token: string;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  whaleSize?: number;
  reason?: string;
  timestamp: number;
};