"use client";

import { useEffect, useState } from "react";
import { socket } from "@/services/socket";

type ChartPoint = {
  time: string;
  whales: number;
};

export function useChartData() {
  const [data, setData] = useState<ChartPoint[]>([
    { time: "09:00", whales: 12 },
    { time: "10:00", whales: 18 },
    { time: "11:00", whales: 24 },
    { time: "12:00", whales: 20 },
    { time: "13:00", whales: 34 },
  ]);

  useEffect(() => {
    socket.on("new-signal", (signal) => {
      setData((prev) => {
        const nextValue =
          prev[prev.length - 1].whales +
          Math.floor(Math.random() * 12);

        const next = [
          ...prev,
          {
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            whales: nextValue,
          },
        ];

        // Keep only latest 12 points
        return next.slice(-12);
      });
    });

    return () => {
      socket.off("new-signal");
    };
  }, []);

  return data;
}