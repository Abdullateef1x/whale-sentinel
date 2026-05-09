type Props = {
  active: string;
  setActive: (view: string) => void;
};

const navItems = [
  "Dashboard",
  "Signals",
  "Whales",
  "Analytics",
  "Trade Journal",
  "Alerts",
];

export default function Sidebar({
  active,
  setActive,
}: Props) {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-[#0b0e11] flex flex-col">
      {/* LOGO */}
      <div className="h-14 border-b border-zinc-800 flex items-center px-4">
        <h2 className="font-bold text-lg tracking-wide">
          TERMINAL
        </h2>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-3">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
          Market Navigation
        </p>

        <div className="space-y-2">
          {navItems.map((item) => {
            const selected =
              active === item;

            return (
              <button
                key={item}
                onClick={() =>
                  setActive(item)
                }
                className={`w-full text-left px-4 py-3 rounded text-sm transition border ${
                  selected
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </nav>

      {/* STATUS */}
      <div className="border-t border-zinc-800 p-4">
        <div className="rounded border border-zinc-800 bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500 mb-2">
            SYSTEM STATUS
          </p>

          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse"></span>

            Tracking Active
          </div>
        </div>
      </div>
    </aside>
  );
}