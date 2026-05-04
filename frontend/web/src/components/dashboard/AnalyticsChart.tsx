 export default function AnalyticsChart() {
    return (
 <div className="xl:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold">Whale Activity Analytics</h3>
              <div className="flex gap-2">
                <button className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2 text-sm">
                  24H
                </button>
                <button className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium">
                  7D
                </button>
                <button className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2 text-sm">
                  30D
                </button>
              </div>
            </div>

            <div className="h-[360px] rounded-2xl border border-dashed border-zinc-700 flex items-center justify-center bg-black">
              <div className="text-center">
                <p className="text-2xl font-semibold mb-2">
                  Whale Activity Chart
                </p>
                <p className="text-zinc-400">
                  Recharts / TradingView integration goes here
                </p>
              </div>
            </div>
          </div>
    );
 }