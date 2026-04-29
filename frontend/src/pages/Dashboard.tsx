import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Bell, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDashboardMetrics, getAlerts } from '../services/api';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metricsData = await getDashboardMetrics();
        setMetrics(metricsData);
        
        const alertsData = await getAlerts(0, 5); // get top 5 recent alerts
        setAlerts(alertsData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !metrics) {
    return <div className="p-8 text-white">Loading dashboard...</div>;
  }

  const { totalScans, fraudBlocked, avgRiskScore, activeAlerts, riskTrend, riskDistribution } = metrics;

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#070514] text-white font-sans">
      
      {/* Top Header */}
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
          Dashboard
        </h2>
        
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-400 bg-[#110e1f] px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
            Live Monitoring <ChevronDown className="w-4 h-4" />
          </div>
          <div className="relative cursor-pointer">
            <Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
            {activeAlerts > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#070514]"></span>}
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer"></div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#110e1f] border border-white/5 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm mb-2">Total Transactions</p>
          <p className="text-3xl font-bold mb-3">{totalScans.toLocaleString()}</p>
          <p className="text-xs font-medium text-green-400">Live DB Count</p>
        </div>
        <div className="bg-[#110e1f] border border-white/5 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm mb-2">Fraud Detected</p>
          <p className="text-3xl font-bold mb-3">{fraudBlocked.toLocaleString()}</p>
          <p className="text-xs font-medium text-red-400">Live DB Count</p>
        </div>
        <div className="bg-[#110e1f] border border-white/5 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm mb-2">Avg Risk Score</p>
          <p className="text-3xl font-bold mb-3">{avgRiskScore}%</p>
          <p className="text-xs font-medium text-blue-400">System Wide</p>
        </div>
        <div className="bg-[#110e1f] border border-white/5 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm mb-2">System Status</p>
          <p className="text-3xl font-bold mb-3 text-green-400">OPTIMAL</p>
          <p className="text-xs font-medium text-gray-500">All Engines Online</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-[#110e1f] border border-white/5 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Transactions Overview</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Total</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Fraudulent</div>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}K`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#110e1f', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="total" stroke="#a855f7" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#a855f7', stroke: '#070514', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#ef4444', stroke: '#070514', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-[#110e1f] border border-white/5 p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Risk Distribution</h3>
          </div>
          
          <div className="flex-1 relative flex justify-center items-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {riskDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#110e1f', borderColor: '#ffffff20', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold">Risk</span>
              <span className="text-xs text-gray-400">Levels</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-4 px-4">
            {riskDistribution.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="font-medium text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="bg-[#110e1f] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="font-semibold text-lg">Recent Alerts</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/30 text-gray-400 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No recent alerts found.</td>
                </tr>
              ) : alerts.map((alert, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">AL-{alert.id}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(alert.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4">{alert.transaction_id}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{alert.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      alert.severity === 'CRITICAL' ? 'text-red-500' : 
                      alert.severity === 'HIGH' ? 'text-orange-500' : 
                      alert.severity === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      alert.status === 'BLOCKED' ? 'text-red-500' : 
                      alert.status === 'OPEN' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/alerts/${alert.id}`} className="text-purple-400 hover:text-purple-300 font-medium">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
