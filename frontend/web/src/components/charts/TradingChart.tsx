"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useChartData } from "@/hooks/useChartData";

export default function TradingChart() {
  const data = useChartData();
  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wide">
            WHALE FLOW ANALYTICS
          </h2>

          <p className="text-xs text-zinc-500 mt-1">
            Real-time smart money momentum
          </p>
        </div>

        {/* TIMEFRAMES */}
        <div className="flex items-center gap-2">
          {["1H", "4H", "1D", "1W"].map((item, idx) => (
            <button
              key={idx}
              className={`px-3 py-1.5 rounded text-xs border transition ${
                item === "1D"
                  ? "bg-[var(--yellow)] text-black border-[var(--yellow)]"
                  : "border-zinc-700 text-zinc-400 hover:bg-zinc-900"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* MARKET STATS */}
      <div className="grid grid-cols-4 gap-3 p-4 border-b border-zinc-800">
        <div className="bg-black/20 border border-zinc-800 rounded p-3">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
            Smart Flow
          </p>

          <p className="mt-2 text-xl font-bold text-[var(--green)]">
            +82%
          </p>
        </div>

        <div className="bg-black/20 border border-zinc-800 rounded p-3">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
            Whale Volume
          </p>

          <p className="mt-2 text-xl font-bold">
            $4.2M
          </p>
        </div>

        <div className="bg-black/20 border border-zinc-800 rounded p-3">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
            Buy Pressure
          </p>

          <p className="mt-2 text-xl font-bold text-[var(--green)]">
            71%
          </p>
        </div>

        <div className="bg-black/20 border border-zinc-800 rounded p-3">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
            Signal Bias
          </p>

          <p className="mt-2 text-xl font-bold text-[var(--yellow)]">
            BULLISH
          </p>
        </div>
      </div>

      {/* CHART */}
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="colorWhales"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#0ECB81"
                  stopOpacity={0.4}
                />

                <stop
                  offset="95%"
                  stopColor="#0ECB81"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e2329"
            />

            <XAxis
              dataKey="time"
              stroke="#666"
              tick={{ fill: "#777", fontSize: 11 }}
            />

            <YAxis
              stroke="#666"
              tick={{ fill: "#777", fontSize: 11 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#11151c",
                border: "1px solid #1e2329",
                borderRadius: "8px",
                color: "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="whales"
              stroke="#0ECB81"
              fillOpacity={1}
              fill="url(#colorWhales)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER */}
      <div className="border-t border-zinc-800 px-4 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-5 text-zinc-500">
          <span>
            Active Wallets:{" "}
            <span className="text-white">
              142
            </span>
          </span>

          <span>
            AI Confidence:{" "}
            <span className="text-[var(--green)]">
              91%
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[var(--green)]">
  <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse"></span>

  LIVE FLOW
</div>
      </div>
    </div>
  );
}