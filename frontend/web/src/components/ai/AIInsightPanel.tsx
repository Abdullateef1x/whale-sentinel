"use client";

import { useEffect, useState } from "react";
import { socket } from "@/services/socket";

type Insight = {
  token: string;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  momentum: string;
  risk: string;
  outlook: string;
};

const starterInsight: Insight = {
  token: "BONK",
  signal: "BUY",
  confidence: 91,
  reasoning:
    "Whale wallets continue aggressive accumulation while short-term momentum remains positive across Solana meme liquidity pools.",
  momentum: "Strong Bullish Momentum",
  risk: "Moderate Risk",
  outlook:
    "Probability of continuation remains high if whale inflows persist above recent averages.",
};

export default function AIInsightPanel() {
  const [insight, setInsight] =
    useState<Insight>(starterInsight);

  useEffect(() => {
    socket.on("new-signal", (signal) => {
      const bullish =
        signal.signal === "BUY";

      const generatedInsight: Insight = {
        token: signal.token,

        signal: signal.signal,

        confidence: signal.confidence,

        reasoning: bullish
          ? `AI models detected strong whale accumulation behavior in ${signal.token} with increasing liquidity inflows and positive momentum divergence.`
          : `AI models detected distribution pressure in ${signal.token} as whale wallets begin reducing exposure amid weakening momentum.`,

        momentum: bullish
          ? "Bullish Expansion"
          : "Bearish Weakness",

        risk: bullish
          ? "Moderate Risk"
          : "Elevated Risk",

        outlook: bullish
          ? "Continuation probability remains favorable while whale demand stays elevated."
          : "Downside pressure may continue unless buy-side liquidity returns.",
      };

      setInsight(generatedInsight);
    });

    return () => {
      socket.off("new-signal");
    };
  }, []);

  const bullish =
    insight.signal === "BUY";

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wide">
            AI SIGNAL INTELLIGENCE
          </h2>

          <p className="text-xs text-zinc-500 mt-1">
            Machine-generated market reasoning
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--yellow)]">
          <span className="w-2 h-2 rounded-full bg-[var(--yellow)] animate-pulse"></span>

          AI ACTIVE
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TOKEN HEADER */}
        <div className="rounded-lg border border-zinc-800 bg-black/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Current Focus
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {insight.token}
              </h3>
            </div>

            <div
              className={`px-4 py-2 rounded font-bold text-sm ${
                bullish
                  ? "bg-[var(--green)]/10 text-[var(--green)]"
                  : "bg-[var(--red)]/10 text-[var(--red)]"
              }`}
            >
              {insight.signal}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
              AI Confidence
            </p>

            <div className="w-full h-3 rounded bg-zinc-900 overflow-hidden">
              <div
                className={`h-full ${
                  bullish
                    ? "bg-[var(--green)]"
                    : "bg-[var(--red)]"
                }`}
                style={{
                  width: `${insight.confidence}%`,
                }}
              />
            </div>

            <div className="mt-2 text-sm font-semibold">
              {insight.confidence}%
            </div>
          </div>
        </div>

        {/* REASONING */}
        <div className="rounded-lg border border-zinc-800 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500 mb-3">
            AI Reasoning
          </p>

          <p className="text-sm leading-relaxed text-zinc-300">
            {insight.reasoning}
          </p>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-lg border border-zinc-800 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
              Momentum
            </p>

            <p className="text-sm font-semibold text-[var(--green)]">
              {insight.momentum}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
              Risk Assessment
            </p>

            <p className="text-sm font-semibold text-[var(--yellow)]">
              {insight.risk}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
              AI Outlook
            </p>

            <p className="text-sm leading-relaxed text-zinc-300">
              {insight.outlook}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}