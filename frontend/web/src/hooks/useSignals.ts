"use client";

import { useEffect, useState } from "react";
import { fetchSignals } from "../services/api";
import { socket } from "../services/socket";
import { Signal } from "../types/signal";

export function useSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initial REST fetch
    fetchSignals()
      .then((data) => {
        setSignals(data.reverse());
      })
      .catch(console.error);

    // Socket connected
    socket.on("connect", () => {
      console.log("🟢 Socket connected");

      setConnected(true);
    });

    // Incoming live signals
    socket.on("new-signal", (signal: Signal) => {
      console.log("📡 LIVE SIGNAL:", signal);

      setSignals((prev) => [signal, ...prev]);
    });

    // Socket disconnected
    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");

      setConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new-signal");
    };
  }, []);

  return {
    signals,
    connected,
  };
}