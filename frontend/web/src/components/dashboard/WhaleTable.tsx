export default function WhaleTable() {

    const whales = [
    {
      wallet: "9xQe...4mZp",
      action: "Accumulating",
      token: "BONK",
      size: "$512K",
    },
    {
      wallet: "3FgA...PqLs",
      action: "Distribution",
      token: "JUP",
      size: "$290K",
    },
    {
      wallet: "8LmR...TkQa",
      action: "Accumulating",
      token: "WIF",
      size: "$811K",
    },
  ];

    return (
<div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 overflow-x-auto">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold">Tracked Whale Wallets</h3>
            <button className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2 text-sm hover:border-zinc-700 transition">
              Export Data
            </button>
          </div>

          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-sm text-zinc-400">
                <th className="pb-4 font-medium">Wallet</th>
                <th className="pb-4 font-medium">Activity</th>
                <th className="pb-4 font-medium">Token</th>
                <th className="pb-4 font-medium">Size</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {whales.map((wallet, idx) => (
                <tr
                  key={idx}
                  className="border-b border-zinc-900 hover:bg-zinc-900/40 transition"
                >
                  <td className="py-5 font-medium">{wallet.wallet}</td>
                  <td className="py-5">{wallet.action}</td>
                  <td className="py-5">{wallet.token}</td>
                  <td className="py-5">{wallet.size}</td>
                  <td className="py-5">
                    <span className="rounded-full bg-green-500/10 text-green-400 px-3 py-1 text-sm">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    );
}