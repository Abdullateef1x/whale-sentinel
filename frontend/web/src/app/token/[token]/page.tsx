"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API = "http://localhost:5000/api/signals";

export default function TokenPage() {
  const params = useParams();
  const token = params.token;

  const [data, setData] = useState<any>(null);

  const load = async () => {
    const res = await fetch(`${API}/token/${token}`);
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">📊 {token} Analytics</h1>

      {/* METRICS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 rounded">
          <p>Buy Pressure</p>
          <p className="text-green-400 text-xl">
            {(data.buyPressure * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded">
          <p>Sell Pressure</p>
          <p className="text-red-400 text-xl">
            {(data.sellPressure * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded">
          <p>Momentum Score</p>
          <p className="text-yellow-400 text-xl">
            {data.momentumScore}
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded">
          <p>Bias</p>
          <p className="text-blue-400 text-xl">
            {data.bias}
          </p>
        </div>
      </div>

      {/* SIGNAL HISTORY */}
      <div>
        <h2 className="text-lg font-bold mb-2">🔥 Recent Signals</h2>

        <div className="space-y-2">
          {data.signals.map((s: any, i: number) => (
            <div
              key={i}
              className="bg-gray-800 p-3 rounded flex justify-between"
            >
              <span>{s.signal}</span>
              <span>{s.reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}