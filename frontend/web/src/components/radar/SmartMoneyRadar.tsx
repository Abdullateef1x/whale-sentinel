"use client";

import { useEffect, useState } from "react";
import { socket } from "@/services/socket";

type Wallet = {
  address: string;
  label: "SMART MONEY" | "WHALE" | "BOT" | "MOMENTUM";
  score: number;
  pnl: number;
  trades: number;
};

export default function SmartMoneyRadar() {
  const [wallets, setWallets] =
    useState<Wallet[]>([]);

  useEffect(() => {
    // 🧠 initial backend fetch
    fetch("http://localhost:5000/api/wallets")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(setWallets)
      .catch(console.error);

    // ⚡ realtime backend updates
    socket.on("wallet-update", (data) => {
      setWallets(data);
    });

    return () => {
      socket.off("wallet-update");
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-wide">
          SMART MONEY RADAR
        </h2>

        <p className="text-xs text-zinc-500 mt-1">
          Real-time wallet intelligence
        </p>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto">
        {wallets
          .sort((a, b) => b.score - a.score)
          .map((w, idx) => (
            <div
              key={idx}
              className="border-b border-zinc-900 p-4 hover:bg-zinc-900/40 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono text-zinc-300">
                    {w.address}
                  </p>

                  <span
                    className={`text-xs mt-1 inline-block px-2 py-1 rounded ${
                      w.label === "SMART MONEY"
                        ? "bg-green-500/10 text-green-400"
                        : w.label === "WHALE"
                        ? "bg-blue-500/10 text-blue-400"
                        : w.label === "MOMENTUM"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {w.label}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">
                    {w.score}
                  </p>

                  <p className="text-xs text-zinc-500">
                    Score
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 text-xs text-zinc-400">
                <div>
                  PnL:{" "}
                  <span
                    className={
                      w.pnl >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {w.pnl.toFixed(1)}%
                  </span>
                </div>

                <div>
                  Trades: {w.trades}
                </div>
              </div>

              <div className="mt-3 h-2 bg-zinc-900 rounded overflow-hidden">
                <div
                  className="h-full bg-[var(--green)] transition-all"
                  style={{
                    width: `${w.score}%`,
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}