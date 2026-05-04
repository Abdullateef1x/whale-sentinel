export default function LiveSignalFeed() {

    const signals = [
    {
      token: "BONK",
      type: "BUY",
      whale: "$240K",
      confidence: "91%",
      time: "2m ago",
    },
    {
      token: "JUP",
      type: "SELL",
      whale: "$118K",
      confidence: "82%",
      time: "5m ago",
    },
    {
      token: "WIF",
      type: "BUY",
      whale: "$420K",
      confidence: "94%",
      time: "9m ago",
    },
    {
      token: "PYTH",
      type: "SELL",
      whale: "$88K",
      confidence: "74%",
      time: "14m ago",
    },
  ];


    return (
<div className="xl:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold">Live Signal Feed</h3>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                LIVE
              </div>
            </div>

            <div className="space-y-4">
              {signals.map((signal, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-800 bg-black p-4 hover:border-zinc-700 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-lg">{signal.token}</p>
                      <p className="text-sm text-zinc-400">{signal.time}</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        signal.type === "BUY"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {signal.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <p className="text-zinc-400">Whale Size</p>
                    <p>{signal.whale}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm mt-2">
                    <p className="text-zinc-400">Confidence</p>
                    <p className="text-green-400">{signal.confidence}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
    );
}