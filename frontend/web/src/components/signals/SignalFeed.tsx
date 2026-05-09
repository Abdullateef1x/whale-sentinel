"use client";

import { useSignals } from "@/hooks/useSignals";
import SignalRow from "./SignalRow";

export default function SignalFeed() {
  const { signals, connected } =
    useSignals();

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wide">
            LIVE SIGNAL FEED
          </h2>

          <p className="text-xs text-zinc-500 mt-1">
            AI-filtered whale intelligence
          </p>
        </div>

        <div
          className={`flex items-center gap-2 text-xs ${
            connected
              ? "text-[var(--green)]"
              : "text-[var(--red)]"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              connected
                ? "bg-[var(--green)]"
                : "bg-[var(--red)]"
            }`}
          ></span>

          {connected
            ? "LIVE"
            : "OFFLINE"}
        </div>
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-5 px-3 py-2 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500 bg-black/20">
        <span>Token</span>
        <span>Signal</span>
        <span>Score</span>
        <span>Whale</span>
        <span>Time</span>
      </div>

      {/* SIGNALS */}
      <div className="flex-1 overflow-y-auto">
        {signals.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
            Waiting for live whale activity...
          </div>
        ) : (
          [...signals]
            .sort(
              (a, b) =>
                b.timestamp -
                a.timestamp
            )
            .map((signal, idx) => (
              <SignalRow
                key={`${signal.signature}-${idx}`}
                signal={{
                  token:
                    signal.token ||
                    "SOL",

                  type:
                    signal.signal ||
                    "HOLD",

                  signalScore: Number(
                    (
                      signal.confidence *
                      100
                    ).toFixed(0)
                  ),

                  whale:
                    signal.amount
                      ? `$${(
                          signal.amount /
                          1_000_000
                        ).toFixed(2)}M`
                      : "$0",

                  time:
                    signal.timestamp
                      ? new Date(
                          signal.timestamp
                        ).toLocaleTimeString()
                      : "LIVE",

                  confidence: `${(
                    signal.confidence *
                    100
                  ).toFixed(0)}%`,
                }}
              />
            ))
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t border-zinc-800 p-3 bg-black/20">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="border border-zinc-800 rounded p-2">
            <p className="text-zinc-500 mb-1">
              Live Signals
            </p>

            <p className="text-[var(--green)] font-bold">
              {signals.length}
            </p>
          </div>

          <div className="border border-zinc-800 rounded p-2">
            <p className="text-zinc-500 mb-1">
              Connection
            </p>

            <p
              className={`font-bold ${
                connected
                  ? "text-[var(--green)]"
                  : "text-[var(--red)]"
              }`}
            >
              {connected
                ? "ONLINE"
                : "OFFLINE"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}