"use client";

export default function StatCard({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-zinc-400 text-sm">{label}</p>

      <h3 className="text-3xl font-bold mt-3">
        {value}
      </h3>

      <p
        className={`text-sm mt-2 ${
          positive ? "text-green-400" : "text-zinc-400"
        }`}
      >
        Live metric
      </p>
    </div>
  );
}