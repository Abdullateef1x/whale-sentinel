type Trade = {
  token: string;
  side: "LONG" | "SHORT";
  entry: string;
  pnl: string;
  status: "OPEN" | "CLOSED";
};

export default function TradeRow({
  trade,
}: {
  trade: Trade;
}) {
  const positive =
    trade.pnl.includes("+");

  return (
    <div className="grid grid-cols-5 items-center px-4 py-3 border-b border-zinc-900 hover:bg-zinc-900/40 transition text-sm">
      <div className="font-semibold">
        {trade.token}
      </div>

      <div
        className={`font-semibold ${
          trade.side === "LONG"
            ? "text-[var(--green)]"
            : "text-[var(--red)]"
        }`}
      >
        {trade.side}
      </div>

      <div>{trade.entry}</div>

      <div
        className={`font-semibold ${
          positive
            ? "text-[var(--green)]"
            : "text-[var(--red)]"
        }`}
      >
        {trade.pnl}
      </div>

      <div>
        <span
          className={`px-2 py-1 rounded text-xs ${
            trade.status === "OPEN"
              ? "bg-[var(--yellow)]/10 text-[var(--yellow)]"
              : "bg-zinc-700 text-zinc-200"
          }`}
        >
          {trade.status}
        </span>
      </div>
    </div>
  );
}