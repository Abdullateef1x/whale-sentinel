"use client";

import { useEffect, useState } from "react";
import { socket } from "@/services/socket";

type TickerItem = {
  id: number;
  text: string;
};

const starterItems: TickerItem[] = [
  {
    id: 1,
    text: "🐋 BONK whale accumulation detected • $420K",
  },

  {
    id: 2,
    text: "📈 WIF bullish momentum expanding",
  },

  {
    id: 3,
    text: "⚡ JUP smart-money inflows rising",
  },

  {
    id: 4,
    text: "🔥 SOL volatility spike detected",
  },
];

export default function LiveTicker() {
  const [items, setItems] =
    useState<TickerItem[]>(starterItems);

  useEffect(() => {
    socket.on("new-signal", (signal) => {
      const bullish =
        signal.signal === "BUY";

      const newItem: TickerItem = {
        id: Date.now(),

        text: bullish
          ? `🐋 ${signal.token} whale accumulation detected • confidence ${signal.confidence}%`
          : `⚠️ ${signal.token} whale distribution pressure detected • confidence ${signal.confidence}%`,
      };

      setItems((prev) => [
        newItem,
        ...prev,
      ]);
    });

    return () => {
      socket.off("new-signal");
    };
  }, []);

  return (
    <div className="w-full overflow-hidden border-b border-zinc-800 bg-black">
      <div className="ticker-track">
        {[...items, ...items].map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="ticker-item"
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}