"use client";

import { useEffect, useState } from "react";
import { fetchSignals } from "../services/api";
import { io } from "socket.io-client";

export type Signal = {
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reason: string;
  token: string;
  timestamp: number;
};

const socket = io("http://localhost:5000");

export const useSignals = () => {
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    // Initial load
    fetchSignals().then((data) => setSignals(data.reverse()));

    // 🔥 Listen for real-time signals
    socket.on("new-signal", (signal: Signal) => {
      setSignals((prev) => [signal, ...prev]);
    });

    return () => {
      socket.off("new-signal");
    };
  }, []);

  return { signals };
};