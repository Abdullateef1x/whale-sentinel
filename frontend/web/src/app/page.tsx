"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import SignalFeed from "@/components/SignalFeed";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Solana Alpha Terminal</h1>
        <WalletMultiButton />
      </div>

      <SignalFeed />
    </main>
  );
}