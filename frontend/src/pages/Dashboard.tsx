import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  isPositive?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, isPositive }) => (
  <div className="bg-[#151921] border border-white/5 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-5">
    <p className="text-gray-400 text-sm mb-2">{label}</p>
    <p className="text-3xl font-bold font-heading text-white">{value}</p>
    {trend && (
      <div className={`mt-4 text-xs font-mono font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? '↑' : '↓'} {trend} vs last week
      </div>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const trendData = [30, 45, 60, 25, 40, 55, 70, 85, 40, 30, 60, 50];
  
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#0e0e0e]">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold font-heading text-white tracking-tight">Security Overview</h2>
          <p className="text-gray-500 mt-1">Real-time threat monitoring and fraud analysis feed.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-5 py-2.5 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-bold text-green-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> SYSTEM OPTIMAL
          </div>
          <div className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-mono text-cyan-400">
            API: <span className="text-white">OPERATIONAL</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard label="Total Transactions" value="1,284,592" trend="12.5%" isPositive={true} />
        <MetricCard label="Fraud Intercepted" value="42,103" trend="4.2%" isPositive={false} />
        <MetricCard label="Avg Risk Score" value="14.2%" trend="2.1%" isPositive={true} />
        <MetricCard label="System Uptime" value="99.99%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Trend Chart */}
        <div className="lg:col-span-2 bg-[#151921] border border-white/5 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-heading font-semibold text-xl text-white">Risk Trend</h3>
            <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">Last 24 Hours</span>
          </div>
          
          <div className="h-64 flex items-end gap-3 px-2">
            {trendData.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col justify-end group">
                <div 
                  className="w-full bg-cyan-400/20 group-hover:bg-cyan-400/40 transition-all rounded-t-lg relative"
                  style={{ height: `${val}%` }}
                >
                  <div className="absolute inset-0 bg-cyan-400/5 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="mt-2 text-[10px] text-gray-600 text-center font-mono">
                  {idx * 2}h
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Risky IPs */}
        <div className="bg-[#151921] border border-white/5 p-8 rounded-3xl">
          <h3 className="font-heading font-semibold text-xl mb-8 text-white">Top Target IPs</h3>
          <div className="space-y-4">
            {[
              { ip: "192.168.1.45", severity: "CRITICAL", score: "94%" },
              { ip: "203.0.113.88", severity: "HIGH", score: "82%" },
              { ip: "185.22.41.90", severity: "HIGH", score: "78%" },
              { ip: "45.12.33.24", severity: "MEDIUM", score: "45%" },
              { ip: "102.4.99.12", severity: "MEDIUM", score: "39%" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-cyan-400/30 transition-all cursor-pointer group">
                <div>
                  <p className="font-mono text-sm text-gray-300 group-hover:text-cyan-400 transition-colors">{item.ip}</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Network Trace Active</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    item.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 
                    item.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {item.severity}
                  </span>
                  <p className="text-sm font-bold text-white mt-1">{item.score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
