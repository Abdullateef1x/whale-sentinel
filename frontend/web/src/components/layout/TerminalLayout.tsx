import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function TerminalLayout({
  left,
  center,
  right,
  activeView,
  setActiveView,
}: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;

  activeView: string;
  setActiveView: (
    view: string
  ) => void;
}) {
  return (
    <div className="h-screen flex bg-[#0b0e11] text-white">
      <Sidebar
        active={activeView}
        setActive={setActiveView}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-hidden terminal-grid">
          <div className="grid grid-cols-12 gap-3 p-3 h-full">
            {/* LEFT PANEL */}
            <section className="col-span-3 border border-zinc-800 bg-[#11151c] rounded-lg overflow-hidden">
              {left}
            </section>

            {/* CENTER PANEL */}
            <section className="col-span-6 border border-zinc-800 bg-[#11151c] rounded-lg overflow-hidden">
              {center}
            </section>

            {/* RIGHT PANEL */}
            <section className="col-span-3 border border-zinc-800 bg-[#11151c] rounded-lg overflow-hidden">
              {right}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}