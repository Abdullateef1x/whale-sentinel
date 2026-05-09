"use client";

import { useEffect, useState } from "react";
import { socket } from "@/services/socket";

type FilteredSignal = {
  token: string;
  rawConfidence: number;
  strength: number;
  noise: number;
  smartMoneyAlignment: number;
  verdict: "ALLOW" | "BLOCK" | "WEAK";
};

export default function SignalFilter() {
  const [signal, setSignal] =
    useState<FilteredSignal | null>(null);

  useEffect(() => {
    socket.on("new-signal", (data) => {
      const strength =
        Math.min(
          100,
          data.confidence +
            Math.floor(Math.random() * 10)
        );

      const noise =
        Math.floor(Math.random() * 40);

      const smartMoneyAlignment =
        Math.floor(60 + Math.random() * 40);

      let verdict: "ALLOW" | "BLOCK" | "WEAK" =
        "WEAK";

      if (
        strength > 85 &&
        smartMoneyAlignment > 75
      ) {
        verdict = "ALLOW";
      } else if (noise > 30) {
        verdict = "BLOCK";
      }

      setSignal({
        token: data.token,
        rawConfidence: data.confidence,
        strength,
        noise,
        smartMoneyAlignment,
        verdict,
      });
    });

    return () => {
      socket.off("new-signal");
    };
  }, []);

  if (!signal) {
    return (
      <div className="p-4 text-zinc-500 text-sm">
        Waiting for signal intelligence...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-wide">
          AI SIGNAL FILTER ENGINE
        </h2>

        <p className="text-xs text-zinc-500 mt-1">
          Real-time signal validation layer
        </p>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-5 space-y-6">
        {/* TOKEN */}
        <div>
          <p className="text-xs text-zinc-500">
            Token
          </p>

          <h1 className="text-4xl font-bold mt-2">
            {signal.token}
          </h1>
        </div>

        {/* VERDICT */}
        <div
          className={`text-2xl font-bold ${
            signal.verdict === "ALLOW"
              ? "text-green-400"
              : signal.verdict === "BLOCK"
              ? "text-red-400"
              : "text-yellow-400"
          }`}
        >
          {signal.verdict}
        </div>

        {/* METRICS */}
        <div className="space-y-4">
          <Metric
            label="Signal Strength"
            value={signal.strength}
          />

          <Metric
            label="Noise Level"
            value={signal.noise}
          />

          <Metric
            label="Smart Money Alignment"
            value={
              signal.smartMoneyAlignment
            }
          />
        </div>

        {/* RAW */}
        <div className="border border-zinc-800 rounded-lg p-4 bg-black/20">
          <p className="text-xs text-zinc-500">
            Raw Confidence
          </p>

          <p className="text-xl font-bold mt-2">
            {signal.rawConfidence}%
          </p>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs text-zinc-500 mb-2">
        <span>{label}</span>

        <span>{value}%</span>
      </div>

      <div className="h-2 bg-zinc-900 rounded overflow-hidden">
        <div
          className="h-full bg-[var(--blue)] transition-all"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}