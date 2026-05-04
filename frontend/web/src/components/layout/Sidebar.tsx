 export default function Sidebar() {

    return (

 <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-6 hidden lg:flex flex-col justify-between">
        <div>
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight">
              WhaleSentinel
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              Real-time Solana intelligence terminal
            </p>
          </div>

          <nav className="space-y-3">
            <button className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-left hover:border-zinc-700 transition">
              Dashboard
            </button>
            <button className="w-full rounded-xl bg-zinc-950 border border-zinc-900 px-4 py-3 text-left hover:border-zinc-700 transition">
              Signals
            </button>
            <button className="w-full rounded-xl bg-zinc-950 border border-zinc-900 px-4 py-3 text-left hover:border-zinc-700 transition">
              Whale Tracker
            </button>
            <button className="w-full rounded-xl bg-zinc-950 border border-zinc-900 px-4 py-3 text-left hover:border-zinc-700 transition">
              Analytics
            </button>
            <button className="w-full rounded-xl bg-zinc-950 border border-zinc-900 px-4 py-3 text-left hover:border-zinc-700 transition">
              Alerts
            </button>
          </nav>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-400">System Status</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm font-medium">Live Tracking Active</p>
          </div>
        </div>
      </aside>
    );
 }