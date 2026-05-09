"use client";

import { useEffect, useMemo, useState } from "react";

const commands = [
  {
    label: "Track BONK",
    command: "track BONK",
  },

  {
    label: "Analyze SOL",
    command: "analyze SOL",
  },

  {
    label: "Whale Activity WIF",
    command: "whale WIF",
  },

  {
    label: "Replay Signals",
    command: "replay signals",
  },

  {
    label: "Portfolio Overview",
    command: "portfolio",
  },

  {
    label: "Open AI Insights",
    command: "ai insights",
  },
];

export default function CommandPalette() {
  const [open, setOpen] =
    useState(false);

  const [query, setQuery] =
    useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();

        setOpen((prev) => !prev);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      down
    );

    return () =>
      window.removeEventListener(
        "keydown",
        down
      );
  }, []);

  const filtered = useMemo(() => {
    return commands.filter((cmd) =>
      cmd.command
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24">
      <div className="w-[700px] rounded-xl border border-zinc-800 bg-[#050505] shadow-2xl overflow-hidden">
        {/* INPUT */}
        <div className="border-b border-zinc-800 px-4 py-4 flex items-center gap-3">
          <span className="text-zinc-500 text-lg">
            &gt;
          </span>

          <input
            autoFocus
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Enter command..."
            className="w-full bg-transparent outline-none text-sm text-zinc-200 placeholder:text-zinc-600"
          />
        </div>

        {/* RESULTS */}
        <div className="max-h-[400px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-sm text-zinc-500">
              No matching commands
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                className="w-full px-4 py-4 text-left hover:bg-zinc-900 transition border-b border-zinc-900"
                onClick={() => {
                  console.log(
                    "COMMAND:",
                    item.command
                  );

                  setOpen(false);
                  setQuery("");
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>

                  <span className="text-xs text-zinc-500 font-mono">
                    {item.command}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-zinc-800 px-4 py-3 flex items-center justify-between text-xs text-zinc-500">
          <span>
            ↑↓ Navigate
          </span>

          <span>
            Enter Execute
          </span>

          <span>
            Esc Close
          </span>
        </div>
      </div>
    </div>
  );
}