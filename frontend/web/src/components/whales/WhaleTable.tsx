"use client";

import { useEffect, useState } from "react";
import { socket } from "@/services/socket";
import WhaleRow from "./WhaleRow";

type Whale = {
  wallet: string;
  token: string;
  action: string;
  volume: string;
  pnl: string;
  status: "ACCUMULATING" | "DISTRIBUTING";
};

const starterData: Whale[] = [
  {
    wallet: "9xQe...4mZp",
    token: "BONK",
    action: "Heavy Buying",
    volume: "$420K",
    pnl: "+18%",
    status: "ACCUMULATING",
  },

  {
    wallet: "8LmR...TkQa",
    token: "WIF",
    action: "Position Scaling",
    volume: "$811K",
    pnl: "+31%",
    status: "ACCUMULATING",
  },

  {
    wallet: "3FgA...PqLs",
    token: "JUP",
    action: "Profit Taking",
    volume: "$290K",
    pnl: "-4%",
    status: "DISTRIBUTING",
  },
];

export default function WhaleTable() {
  const [whales, setWhales] =
    useState<Whale[]>(starterData);

  useEffect(() => {
    socket.on("new-signal", (signal) => {
      const bullish =
        signal.signal === "BUY";

      const newWhale: Whale = {
        wallet:
          Math.random()
            .toString(36)
            .substring(2, 8) + "...X9p",
        token: signal.token,
        action: bullish
          ? "Accumulating"
          : "Distributing",
        volume: `$${Math.floor(
          Math.random() * 900
        )}K`,
        pnl: bullish
          ? `+${Math.floor(
              Math.random() * 40
            )}%`
          : `-${Math.floor(
              Math.random() * 12
            )}%`,
        status: bullish
          ? "ACCUMULATING"
          : "DISTRIBUTING",
      };

      setWhales((prev) => [
        newWhale,
        ...prev,
      ]);
    });

    return () => {
      socket.off("new-signal");
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wide">
            SMART MONEY RADAR
          </h2>

          <p className="text-xs text-zinc-500 mt-1">
            Whale wallet intelligence
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--green)]">
          <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse"></span>

          TRACKING
        </div>
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-6 px-4 py-2 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500 bg-black/20">
        <span>Wallet</span>
        <span>Token</span>
        <span>Action</span>
        <span>Volume</span>
        <span>PnL</span>
        <span>Status</span>
      </div>

      {/* ROWS */}
      <div className="flex-1 overflow-y-auto">
        {whales.map((whale, idx) => (
          <WhaleRow
            key={idx}
            whale={whale}
          />
        ))}
      </div>
    </div>
  );
}
