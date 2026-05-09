"use client";

import { useEffect, useState } from "react";
import { socket } from "@/services/socket";

type ReplaySignal = {
  token: string;
  signal: "BUY" | "SELL";
  confidence: number;
  timestamp: string;
};

const historicalSignals: ReplaySignal[] = [
  {
    token: "BONK",
    signal: "BUY",
    confidence: 92,
    timestamp: "2h ago",
  },

  {
    token: "WIF",
    signal: "SELL",
    confidence: 81,
    timestamp: "1h 40m ago",
  },

  {
    token: "JUP",
    signal: "BUY",
    confidence: 88,
    timestamp: "1h ago",
  },

  {
    token: "SOL",
    signal: "BUY",
    confidence: 95,
    timestamp: "45m ago",
  },
];

export default function SignalReplay() {
  const [replaying, setReplaying] =
    useState(false);

  const [index, setIndex] =
    useState(0);

  const [current, setCurrent] =
    useState<ReplaySignal | null>(null);

  const startReplay = () => {
    setReplaying(true);
    setIndex(0);
  };

  useEffect(() => {
    if (!replaying) return;

    if (index >= historicalSignals.length) {
      setReplaying(false);
      return;
    }

    const timer = setTimeout(() => {
      const signal =
        historicalSignals[index];

      setCurrent(signal);

      // broadcast like live signal
      socket.emit("replay-signal", signal);

      setIndex((prev) => prev + 1);
    }, 1200);

    return () =>
      clearTimeout(timer);
  }, [replaying, index]);

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-wide">
          SIGNAL REPLAY ENGINE
        </h2>

        <p className="text-xs text-zinc-500 mt-1">
          Backtesting whale activity
        </p>
      </div>

      {/* CURRENT SIGNAL */}
      <div className="flex-1 flex items-center justify-center">
        {!current ? (
          <button
            onClick={startReplay}
            className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:opacity-90"
          >
            Start Replay
          </button>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold">
              {current.token}
            </div>

            <div
              className={`text-xl font-semibold ${
                current.signal === "BUY"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {current.signal}
            </div>

            <div className="text-sm text-zinc-400">
              Confidence:{" "}
              {current.confidence}%
            </div>

            <div className="text-xs text-zinc-500">
              {current.timestamp}
            </div>
          </div>
        )}
      </div>

      {/* PROGRESS */}
      <div className="border-t border-zinc-800 p-4">
        <div className="h-2 bg-zinc-900 rounded overflow-hidden">
          <div
            className="h-full bg-[var(--green)] transition-all duration-300"
            style={{
              width: `${
                (index /
                  historicalSignals.length) *
                100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}