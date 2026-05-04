export default function StatCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-zinc-400 text-sm">SOL Price</p>
                <h3 className="text-3xl font-bold mt-3">$182.42</h3>
                <p className="text-green-400 text-sm mt-2">+4.3% today</p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-zinc-400 text-sm">Whales Detected</p>
                <h3 className="text-3xl font-bold mt-3">42</h3>
                <p className="text-zinc-400 text-sm mt-2">Last 24 hours</p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-zinc-400 text-sm">Bullish Signals</p>
                <h3 className="text-3xl font-bold mt-3">18</h3>
                <p className="text-green-400 text-sm mt-2">Strong momentum</p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-zinc-400 text-sm">Alert Latency</p>
                <h3 className="text-3xl font-bold mt-3">0.9s</h3>
                <p className="text-zinc-400 text-sm mt-2">Real-time pipeline</p>
            </div>
        </div>
    );
}
