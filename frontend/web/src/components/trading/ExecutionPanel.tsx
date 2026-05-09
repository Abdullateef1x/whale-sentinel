export default function ExecutionPanel() {
  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-wide">
          EXECUTION PANEL
        </h2>

        <p className="text-xs text-zinc-500 mt-1">
          AI-assisted trade execution
        </p>
      </div>

      {/* CURRENT SIGNAL */}
      <div className="p-4 border-b border-zinc-800">
        <div className="rounded-lg border border-[var(--green)]/20 bg-[var(--green)]/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                Active Signal
              </p>

              <h3 className="text-2xl font-bold mt-2">
                BONK
              </h3>
            </div>

            <span className="px-3 py-1 rounded bg-[var(--green)]/10 text-[var(--green)] text-sm font-semibold">
              BUY
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">
                AI Confidence
              </span>

              <span className="text-[var(--green)] font-semibold">
                91%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500">
                Whale Volume
              </span>

              <span>$420K</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500">
                Momentum Score
              </span>

              <span className="text-[var(--yellow)]">
                88
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TRADE FORM */}
      <div className="p-4 border-b border-zinc-800 space-y-4">
        {/* POSITION SIZE */}
        <div>
          <label className="text-xs uppercase tracking-wide text-zinc-500">
            Position Size
          </label>

          <input
            type="text"
            placeholder="0.00 SOL"
            className="w-full mt-2 bg-black border border-zinc-800 rounded px-3 py-3 text-sm outline-none focus:border-[var(--yellow)]"
          />
        </div>

        {/* LEVERAGE */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs uppercase tracking-wide text-zinc-500">
              Leverage
            </label>

            <span className="text-sm font-semibold">
              10x
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="100"
            defaultValue="10"
            className="w-full"
          />
        </div>

        {/* STOP LOSS */}
        <div>
          <label className="text-xs uppercase tracking-wide text-zinc-500">
            Stop Loss
          </label>

          <input
            type="text"
            placeholder="-5%"
            className="w-full mt-2 bg-black border border-zinc-800 rounded px-3 py-3 text-sm outline-none focus:border-[var(--red)]"
          />
        </div>

        {/* TAKE PROFIT */}
        <div>
          <label className="text-xs uppercase tracking-wide text-zinc-500">
            Take Profit
          </label>

          <input
            type="text"
            placeholder="+20%"
            className="w-full mt-2 bg-black border border-zinc-800 rounded px-3 py-3 text-sm outline-none focus:border-[var(--green)]"
          />
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="p-4 border-b border-zinc-800 space-y-3">
        <button className="w-full bg-[var(--green)] hover:opacity-90 transition text-black font-bold py-3 rounded">
          LONG BONK
        </button>

        <button className="w-full bg-[var(--red)] hover:opacity-90 transition text-white font-bold py-3 rounded">
          SHORT BONK
        </button>
      </div>

      {/* POSITION INFO */}
      <div className="p-4 border-b border-zinc-800">
        <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
          Position Metrics
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">
              Entry Price
            </span>

            <span>$0.000021</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-500">
              Liquidation
            </span>

            <span className="text-[var(--red)]">
              $0.000014
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-500">
              Risk/Reward
            </span>

            <span className="text-[var(--green)]">
              1:4.2
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-auto p-4">
        <div className="rounded border border-zinc-800 bg-black/20 p-3">
          <p className="text-xs text-zinc-500 mb-2">
            AI Trade Insight
          </p>

          <p className="text-sm leading-relaxed text-zinc-300">
            Whale accumulation remains strong with sustained
            buy-side pressure across BONK liquidity pools.
          </p>
        </div>
      </div>
    </div>
  );
}