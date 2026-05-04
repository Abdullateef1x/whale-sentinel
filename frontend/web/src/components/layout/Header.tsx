export default function Header() {
    return (

<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Solana Alpha Terminal
            </h2>
            <p className="text-zinc-400 mt-2">
              Monitor whale activity, trading signals, and market momentum.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-3 hover:border-zinc-700 transition">
              Connect Wallet
            </button>
            <button className="rounded-xl bg-white text-black px-5 py-3 font-medium hover:opacity-90 transition">
              Start Tracking
            </button>
          </div>
        </div>
    )
}