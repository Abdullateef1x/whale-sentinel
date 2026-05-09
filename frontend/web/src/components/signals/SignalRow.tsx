type SignalRowProps = {
  signal: {
    token: string;
    type: "BUY" | "SELL";
    signalScore: number;
    whale: string;
    time: string;
    confidence: string;
  };
};

export default function SignalRow({
  signal,
}: SignalRowProps) {
  const isBuy = signal.type === "BUY";

  return (
    <div className="grid grid-cols-5 items-center px-3 py-3 border-b border-zinc-900 hover:bg-zinc-900/40 transition cursor-pointer text-sm">
      {/* TOKEN */}
      <div className="flex flex-col">
        <span className="font-bold text-white tracking-wide">
          {signal.token}
        </span>

        <span className="text-[11px] text-zinc-500">
          {signal.confidence} confidence
        </span>
      </div>

      {/* TYPE */}
      <div>
        <span
          className={`font-semibold ${
            isBuy
              ? "text-[var(--green)]"
              : "text-[var(--red)]"
          }`}
        >
          {signal.type}
        </span>
      </div>

      {/* SCORE */}
      <div>
        <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[var(--yellow)] font-mono text-xs">
          {signal.signalScore}
        </span>
      </div>

      {/* WHALE SIZE */}
      <div className="text-zinc-300 font-medium">
        {signal.whale}
      </div>

      {/* TIME */}
      <div className="text-zinc-500 text-xs">
        {signal.time}
      </div>
    </div>
  );
}