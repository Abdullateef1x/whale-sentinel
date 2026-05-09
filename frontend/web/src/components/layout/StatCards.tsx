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

export default function StatCards() {
  const [stats, setStats] =
    useState<DashboardStats | null>(
      null
    );

  useEffect(() => {
    // initial load
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

  if (!stats) {
    return (
      <div className="text-zinc-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      {/* SOL PRICE */}
      <Card
        title="SOL Price"
        value={`$${stats.solPrice.toFixed(
          2
        )}`}
        subtitle="Live market feed"
        positive
      />

      {/* WHALES */}
      <Card
        title="Whales Detected"
        value={
          stats.whalesDetected.toString()
        }
        subtitle="Tracked wallets"
      />

      {/* SIGNALS */}
      <Card
        title="Bullish Signals"
        value={
          stats.bullishSignals.toString()
        }
        subtitle={`${stats.bearishSignals} bearish`}
        positive
      />

      {/* LATENCY */}
      <Card
        title="Alert Latency"
        value={`${stats.latency}s`}
        subtitle="Realtime pipeline"
      />
    </div>
  );
}

function Card({
  title,
  value,
  subtitle,
  positive,
}: {
  title: string;
  value: string;
  subtitle: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-zinc-400 text-sm">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-3">
        {value}
      </h3>

      <p
        className={`text-sm mt-2 ${
          positive
            ? "text-green-400"
            : "text-zinc-400"
        }`}
      >
        {subtitle}
      </p>
    </div>
  );
}