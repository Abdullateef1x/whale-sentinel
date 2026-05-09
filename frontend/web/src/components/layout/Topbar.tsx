"use client";

import { useEffect, useState } from "react";
import { socket } from "@/services/socket";

type DashboardStats = {
  solPrice: number;
  whalesDetected: number;
  bullishSignals: number;
  bearishSignals: number;
  latency: number;
};

export default function Topbar() {
  const [stats, setStats] =
    useState<DashboardStats | null>(
      null
    );

  useEffect(() => {
    // initial fetch
    fetch(
      "http://localhost:5000/api/dashboard"
    )
      .then((res) => res.json())
      .then(setStats);

    // realtime updates
    socket.on(
      "dashboard-update",
      (data) => {
        setStats(data);
      }
    );

    return () => {
      socket.off(
        "dashboard-update"
      );
    };
  }, []);

  return (
    <header className="h-14 border-b border-zinc-800 bg-[#0b0e11] flex items-center justify-between px-4">
      {/* LEFT */}
      <div className="flex items-center gap-6 text-sm">
        <h1 className="font-bold tracking-wide text-white">
          WhaleSentinel
        </h1>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500">
            SOL
          </span>

          <span className="text-[var(--green)] font-semibold">
            $
            {stats?.solPrice?.toFixed(
              2
            ) || "--"}
          </span>

          <span className="text-[var(--green)] text-xs">
            LIVE
          </span>
        </div>
      </div>

      {/* CENTER */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-zinc-400">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse"></span>

          LIVE MARKET
        </span>

        <span>
          Latency:{" "}
          {stats?.latency || "--"}s
        </span>

        <span>
          Whales Active:{" "}
          {stats?.whalesDetected ||
            0}
        </span>

        <span>
          Bullish Signals:{" "}
          {stats?.bullishSignals ||
            0}
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <button className="border border-zinc-700 px-4 py-2 rounded text-sm hover:bg-zinc-900 transition">
          Connect Wallet
        </button>

        <button className="bg-[var(--yellow)] text-black font-semibold px-4 py-2 rounded text-sm hover:opacity-90 transition">
          Paper Trading
        </button>
      </div>
    </header>
  );
}