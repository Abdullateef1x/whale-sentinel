import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import StatCards from "./layout/StatCards";
import LiveSignalFeed from "./dashboard/LiveSignalFeed";
import AnalyticsChart from "./dashboard/AnalyticsChart";
import WhaleTable from "./dashboard/WhaleTable";

export default function WhaleSentinelDashboard() {
    return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}

        <Sidebar />     

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        
        <Header />

        {/* Stats */}
        
        <StatCards />

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Live Feed */}

        <LiveSignalFeed />

          {/* Chart Placeholder */}
          
         <AnalyticsChart />

        </div>

        {/* Whale Table */}
        
        <WhaleTable />

      </main>
    </div>
  );
}
