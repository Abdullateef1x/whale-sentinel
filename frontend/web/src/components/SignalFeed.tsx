"use client";

import { useSignals } from "../hooks/useSignals";
import { executeJupiterSwap } from "../services/jupiter";
import { useWallet } from "@solana/wallet-adapter-react";
import { executeTrade } from "../services/trade";

export default function SignalFeed() {

  // SOL (wrapped)
const SOL = "So11111111111111111111111111111111111111112";

// USDC
const USDC = "EPjFWdd5AufqSSqeM2qC3r2s7x4n9bY5n3z9h9t9n";

  const { signals } = useSignals();
  const wallet = useWallet();

  const handleTrade = async () => {
  try {
    await executeJupiterSwap({
      inputMint: SOL,
      outputMint: USDC,
      amount: 10000000, // 0.01 SOL
      wallet,
    });
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">📡 Live Signals</h2>

      {signals.map((s, i) => (
        <div
          key={i}
          className="bg-gray-900 p-4 rounded-xl border border-gray-800"
        >
          <div className="flex justify-between">
            <span>{s.signal}</span>
            <span>{(s.confidence * 100).toFixed(0)}%</span>
          </div>

          <div className="text-sm mt-2">{s.reason}</div>

          {/* 🚀 TRADE BUTTON */}
          {s.signal === "BUY" && (
            <button
              onClick={() => executeTrade(wallet, 1000000)}
              className="mt-3 bg-green-600 px-4 py-2 rounded"
            >
              Trade This Signal
            </button>
            
          )}
          <button
  onClick={handleTrade}
  className="mt-3 bg-green-600 px-4 py-2 rounded"
>
  Swap via Jupiter 🚀
</button>
        </div>
      ))}
    </div>
  );
}