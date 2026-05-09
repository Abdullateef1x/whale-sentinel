"use client";

import { useState } from "react";
import AIInsightPanel from "@/components/ai/AIInsightPanel";
import SignalFilter from "@/components/ai/SignalFilter";
import AlertStack from "@/components/alerts/AlertStack";
import TradingChart from "@/components/charts/TradingChart";
import TerminalLayout from "@/components/layout/TerminalLayout";
import TokenMetrics from "@/components/metrics/TokenMetrics";
import PortfolioPanel from "@/components/portfolio/PortfolioPanel";
import SmartMoneyRadar from "@/components/radar/SmartMoneyRadar";
import SignalReplay from "@/components/replay/SignalReplay";
import SignalFeed from "@/components/signals/SignalFeed";
import CommandPalette from "@/components/terminal/CommandPalette";
import LiveTicker from "@/components/ticker/LiveTicker";
import ExecutionPanel from "@/components/trading/ExecutionPanel";
import WhaleTable from "@/components/whales/WhaleTable";
import DashboardView from "@/components/views/DashboardView";

export default function HomePage() {
  const [activeView, setActiveView] =
  useState("Dashboard");

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">

      {/* TOP TERMINAL LAYERS */}
      <LiveTicker />
      <AlertStack />
      <CommandPalette />

      {/* MAIN TERMINAL */}
      <div className="flex-1 overflow-hidden">
        <TerminalLayout
        activeView={activeView}
  setActiveView={setActiveView}
          left={
            <div className="h-full border-r border-zinc-900">
              <SignalFeed />
            </div>
          }

         center={
  <>
    {activeView ===
      "Dashboard" && (
      <DashboardView />
    )}

    {activeView ===
      "Signals" && (
      <SignalFeed />
    )}

    {activeView ===
      "Whales" && (
      <WhaleTable />
    )}

    {activeView ===
      "Analytics" && (
      <TokenMetrics />
    )}
  </>
}

          right={
            <div className="h-full grid grid-rows-5 gap-3">

              {/* EXECUTION ENGINE */}
              <div className="row-span-2 rounded-lg overflow-hidden border border-green-500/10 bg-zinc-950 shadow-lg shadow-green-500/5">
                <ExecutionPanel />
              </div>

              {/* AI INTELLIGENCE */}
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 transition hover:border-zinc-700">
                <AIInsightPanel />
              </div>

              {/* SMART MONEY */}
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 transition hover:border-zinc-700">
                <SmartMoneyRadar />
              </div>

              {/* TOKEN METRICS */}
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950/90">
                <TokenMetrics />
              </div>

              {/* RISK / FILTER ENGINE */}
              <div className="rounded-lg overflow-hidden border border-red-500/20 bg-black">
                <SignalFilter />
              </div>

            </div>
          }
        />
      </div>
    </div>
  );
}