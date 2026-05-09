"use client";

import { useEffect, useState } from "react";
import { socket } from "@/services/socket";
import StatCard from "@/components/ui/StatCard";
import TradeRow from "./TradeRow";

export default function PortfolioPanel() {
  const [portfolio, setPortfolio] = useState<any>(null);

  useEffect(() => {
    // initial load
    fetch("http://localhost:5000/api/portfolio")
  .then((res) => {
    if (!res.ok) throw new Error("API failed");
    return res.json();
  })
  .then(setPortfolio)
  .catch(console.error);

    // realtime updates
    socket.on("portfolio-update", (data) => {
      setPortfolio(data);
    });

    return () => {
      socket.off("portfolio-update");
    };
  }, []);

  if (!portfolio) {
    return (
      <div className="p-4 text-zinc-500">
        Loading portfolio...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-wide">
          PORTFOLIO ENGINE
        </h2>

        <p className="text-xs text-zinc-500 mt-1">
          Real-time performance tracking
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 p-4 border-b border-zinc-800">
        <StatCard
          label="Portfolio"
          value={`$${portfolio.balance?.toLocaleString()}`}
          positive
        />

        <StatCard
          label="PnL"
          value={`${portfolio.pnl?.toFixed(1)}%`}
          positive={portfolio.pnl >= 0}
        />

        <StatCard
          label="Win Rate"
          value={`${portfolio.winRate?.toFixed(1)}%`}
          positive
        />

        <StatCard
          label="Trades"
value={portfolio.trades?.length?.toString() || "0"}
          positive
        />
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-y-auto">
       {portfolio.trades?.map((trade: any, idx: number) => (
  <TradeRow key={idx} trade={trade} />
))}
      </div>
    </div>
  );
}