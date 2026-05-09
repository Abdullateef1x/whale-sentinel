import TradingChart from "@/components/charts/TradingChart";
import WhaleTable from "@/components/whales/WhaleTable";
import PortfolioPanel from "@/components/portfolio/PortfolioPanel";
import SignalReplay from "@/components/replay/SignalReplay";

export default function DashboardView() {
  return (
    <div className="h-full grid grid-rows-4 gap-3">
      {/* PRIMARY MARKET VIEW */}
      <div className="row-span-2 rounded-lg overflow-hidden border border-green-500/10 bg-zinc-950 shadow-xl shadow-green-500/5">
        <TradingChart />
      </div>

      {/* WHALE ACTIVITY */}
      <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
        <WhaleTable />
      </div>

      {/* LOWER ANALYTICS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950/90">
          <PortfolioPanel />
        </div>

        <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950/90">
          <SignalReplay />
        </div>
      </div>
    </div>
  );
}