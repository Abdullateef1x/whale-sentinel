type WhaleRowProps = {
  whale: {
    wallet: string;
    token: string;
    action: string;
    volume: string;
    pnl: string;
    status: "ACCUMULATING" | "DISTRIBUTING";
  };
};

export default function WhaleRow({
  whale,
}: WhaleRowProps) {
  const bullish =
    whale.status === "ACCUMULATING";

  return (
    <div className="grid grid-cols-6 items-center px-4 py-3 border-b border-zinc-900 hover:bg-zinc-900/40 transition text-sm">
      {/* WALLET */}
      <div className="font-mono text-zinc-300">
        {whale.wallet}
      </div>

      {/* TOKEN */}
      <div className="font-semibold">
        {whale.token}
      </div>

      {/* ACTION */}
      <div
        className={`font-medium ${
          bullish
            ? "text-[var(--green)]"
            : "text-[var(--red)]"
        }`}
      >
        {whale.action}
      </div>

      {/* VOLUME */}
      <div className="text-zinc-300">
        {whale.volume}
      </div>

      {/* PNL */}
      <div className="text-[var(--green)] font-semibold">
        {whale.pnl}
      </div>

      {/* STATUS */}
      <div>
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            bullish
              ? "bg-[var(--green)]/10 text-[var(--green)]"
              : "bg-[var(--red)]/10 text-[var(--red)]"
          }`}
        >
          {whale.status}
        </span>
      </div>
    </div>
  );
}