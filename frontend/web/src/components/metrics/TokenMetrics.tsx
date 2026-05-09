"use client";

import { useEffect, useState } from "react";
import { socket } from "@/services/socket";

type Metrics = {
  token: string;
  buyPressure: number;
  sellPressure: number;
  momentum: number;
  smartMoney: number;
  signalQuality: number;
  whales: number;
};

export default function TokenMetrics() {
  const [metrics, setMetrics] =
    useState<Metrics | null>(null);

  useEffect(() => {
    // 🧠 initial backend fetch
    fetch("http://localhost:5000/api/metrics/SOL")
      .then((res) => res.json())
      .then(setMetrics);

    // ⚡ realtime backend updates
    socket.on("metrics-update", (data) => {
      setMetrics(data);
    });

    return () => {
      socket.off("metrics-update");
    };
  }, []);

  if (!metrics) {
    return (
      <div className="p-4 text-zinc-500">
        Loading metrics...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-wide">
          TOKEN METRICS ENGINE
        </h2>

        <p className="text-xs text-zinc-500 mt-1">
          Real-time quantitative intelligence
        </p>
      </div>

      {/* TOKEN */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Active Asset
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {metrics.token}
            </h3>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Signal Quality
            </p>

            <p className="text-2xl font-bold text-[var(--green)] mt-2">
              {metrics.signalQuality}%
            </p>
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <MetricBar
          label="BUY PRESSURE"
          value={metrics.buyPressure}
          color="var(--green)"
        />

        <MetricBar
          label="SELL PRESSURE"
          value={metrics.sellPressure}
          color="var(--red)"
        />

        <MetricBar
          label="MOMENTUM SCORE"
          value={metrics.momentum}
          color="var(--yellow)"
        />

        <MetricBar
          label="SMART MONEY"
          value={metrics.smartMoney}
          color="var(--blue)"
        />

        <div className="rounded-lg border border-zinc-800 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
            Active Whale Wallets
          </p>

          <div className="flex items-end justify-between">
            <h3 className="text-4xl font-bold">
              {metrics.whales}
            </h3>

            <div className="text-[var(--green)] text-sm font-semibold">
              LIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          {label}
        </p>

        <p className="text-sm font-semibold">
          {value}%
        </p>
      </div>

      <div className="h-3 rounded bg-zinc-900 overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${value}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}