"use client";

import { useEffect, useState } from "react";
import { socket } from "@/services/socket";

type Alert = {
  id: number;
  title: string;
  message: string;
  type: "BUY" | "SELL";
};

export default function AlertStack() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    socket.on("new-signal", (signal) => {
      const alert: Alert = {
        id: Date.now(),

        title:
          signal.signal === "BUY"
            ? "🐋 Whale Accumulation"
            : "⚠️ Whale Distribution",

        message: `${signal.token} • confidence ${signal.confidence}%`,

        type:
          signal.signal === "BUY"
            ? "BUY"
            : "SELL",
      };

      setAlerts((prev) => [alert, ...prev]);

      // auto-remove after 5s
      setTimeout(() => {
        setAlerts((prev) =>
          prev.filter((a) => a.id !== alert.id)
        );
      }, 5000);
    });

    return () => {
      socket.off("new-signal");
    };
  }, []);

  return (
    <div className="fixed top-16 right-5 z-50 flex flex-col gap-3 w-[320px]">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-lg border backdrop-blur-md p-4 shadow-2xl animate-slide-in ${
            alert.type === "BUY"
              ? "border-[var(--green)]/30 bg-[var(--green)]/10"
              : "border-[var(--red)]/30 bg-[var(--red)]/10"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-sm">
                {alert.title}
              </h3>

              <p className="text-xs text-zinc-300 mt-1">
                {alert.message}
              </p>
            </div>

            <div
              className={`w-2 h-2 rounded-full mt-1 ${
                alert.type === "BUY"
                  ? "bg-[var(--green)]"
                  : "bg-[var(--red)]"
              } animate-pulse`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}