import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Bell, ChevronDown, Activity, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDashboardMetrics, getAlerts, API_BASE_URL, predictFraud } from '../services/api';
import { CyberCard } from '../components/CyberCard';
import { CyberBackground } from '../components/CyberBackground';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const metricsData = await getDashboardMetrics();
      setMetrics(metricsData);
      
      const alertsData = await getAlerts(0, 5);
      setAlerts(alertsData);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);

    // WebSocket Connection
    const wsBaseUrl = import.meta.env.VITE_WS_URL || API_BASE_URL.replace(/^http/, 'ws');
    const wsUrl = `${wsBaseUrl}/ws/dashboard`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "dashboard_update") {
          setMetrics(data.metrics);
          if (data.alerts && data.alerts.length > 0) {
            setAlerts(data.alerts);
          }
        }
      } catch (e) {
        console.error("Error parsing WS message", e);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setWsConnected(false);
    };

    return () => {
      clearInterval(interval);
      if (ws.readyState === WebSocket.CONNECTING) {
        ws.addEventListener('open', () => ws.close());
      } else {
        ws.close();
      }
    };
  }, []);

  const handleSimulateFraud = async () => {
    setIsSimulating(true);
    try {
      const promises = [];
      for (let i = 0; i < 15; i++) {
        const randomAmount = Math.random() > 0.8 ? Math.random() * 50000 : Math.random() * 100;
        const payload = {
          user_id: `user_${Math.floor(Math.random() * 1000)}`,
          amount: randomAmount,
          currency: "USD",
          ip_address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.1.1`,
          device_id: `device_${Math.floor(Math.random() * 1000)}`
        };
        // Call predict multiple times
        promises.push(predictFraud(payload).catch(e => console.warn(e)));
      }
      await Promise.all(promises);
      // Immediately refresh dashboard to show results
      await fetchDashboardData();
    } catch (e) {
      console.error("Simulation error:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="flex h-screen bg-[#0b0f19] items-center justify-center text-cyan-400">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        <span className="ml-4 font-mono text-lg animate-pulse">Initializing Fortress X Core...</span>
      </div>
    );
  }

  const { totalScans, fraudBlocked, avgRiskScore, activeAlerts, riskTrend, riskDistribution } = metrics;

  return (
    <div className="relative min-h-screen bg-[#0b0f19] text-white font-sans overflow-hidden">
      <CyberBackground />
      
      <div className="relative z-10 p-8 max-w-[1600px] mx-auto">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.5)]">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Fortress X Command Center
              </h2>
              <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase">System Active // Secure</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button 
              onClick={handleSimulateFraud}
              disabled={isSimulating}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
                isSimulating 
                ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30'
                : 'bg-gradient-to-r from-purple-600/20 to-cyan-600/20 hover:from-purple-600/40 hover:to-cyan-600/40 border border-purple-500/50 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]'
              }`}
            >
              <Zap className={`w-4 h-4 ${isSimulating ? 'animate-pulse' : ''}`} />
              {isSimulating ? 'Simulating Traffic...' : 'Simulate Fraud'}
            </button>

            <div className={`text-sm ${wsConnected ? 'text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(0,243,255,0.2)]' : 'text-gray-400 border-white/10'} bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border flex items-center gap-2 transition-all`}>
              {wsConnected ? (
                <><span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_5px_#00f3ff]"></span> Uplink Active</>
              ) : (
                <>Establishing Uplink <ChevronDown className="w-4 h-4" /></>
              )}
            </div>
            <div className="relative cursor-pointer group">
              <div className="p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl group-hover:border-cyan-500/50 transition-colors">
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              {activeAlerts > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0b0f19] animate-bounce"></span>}
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 cursor-pointer shadow-[0_0_10px_rgba(0,243,255,0.3)]"></div>
          </motion.div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <CyberCard delay={0.1}>
            <div className="flex justify-between items-start mb-2">
              <p className="text-gray-400 text-sm font-mono tracking-wider uppercase">Transactions</p>
              <Activity className="w-5 h-5 text-cyan-400 opacity-50" />
            </div>
            <p className="text-4xl font-bold mb-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {totalScans.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-cyan-400 tracking-wider font-mono">LIVE FEED ACTIVE</p>
          </CyberCard>
          
          <CyberCard delay={0.2} className="border-red-500/20">
            <div className="flex justify-between items-start mb-2">
              <p className="text-gray-400 text-sm font-mono tracking-wider uppercase">Fraud Detected</p>
              <AlertTriangle className="w-5 h-5 text-red-400 opacity-50" />
            </div>
            <p className="text-4xl font-bold mb-2 text-white drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              {fraudBlocked.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-red-400 tracking-wider font-mono">THREATS NEUTRALIZED</p>
          </CyberCard>
          
          <CyberCard delay={0.3}>
            <div className="flex justify-between items-start mb-2">
              <p className="text-gray-400 text-sm font-mono tracking-wider uppercase">Risk Score</p>
              <Activity className="w-5 h-5 text-purple-400 opacity-50" />
            </div>
            <p className="text-4xl font-bold mb-2 text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              {avgRiskScore}%
            </p>
            <p className="text-xs font-medium text-purple-400 tracking-wider font-mono">NETWORK AVERAGE</p>
          </CyberCard>
          
          <CyberCard delay={0.4} className="border-green-500/20">
            <div className="flex justify-between items-start mb-2">
              <p className="text-gray-400 text-sm font-mono tracking-wider uppercase">System Health</p>
              <ShieldCheck className="w-5 h-5 text-green-400 opacity-50" />
            </div>
            <p className="text-4xl font-bold mb-2 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
              OPTIMAL
            </p>
            <p className="text-xs font-medium text-gray-400 tracking-wider font-mono">ALL ENGINES ONLINE</p>
          </CyberCard>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Line Chart */}
          <CyberCard delay={0.5} className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-lg text-white font-bold tracking-wider">NETWORK ACTIVITY</h3>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_#00f3ff]"></div> Volume</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444]"></div> Threats</div>
              </div>
            </div>
            
            <div className="h-[300px] w-full min-w-0 flex-1">
              <ResponsiveContainer width="99%" minHeight={300}>
                <LineChart data={riskTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00f3ff20" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'monospace' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'monospace' }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#00f3ff40', borderRadius: '8px', color: '#fff', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                    labelStyle={{ color: '#00f3ff', fontFamily: 'monospace' }}
                  />
                  <Line type="monotone" dataKey="total" stroke="#00f3ff" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#00f3ff', stroke: '#0f172a', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#ef4444', stroke: '#0f172a', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CyberCard>

          {/* Donut Chart */}
          <CyberCard delay={0.6} className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-lg text-white font-bold tracking-wider">RISK DISTRIBUTION</h3>
            </div>
            
            <div className="flex-1 relative flex justify-center items-center min-w-0">
              <div className="h-[250px] w-full min-w-0">
                <ResponsiveContainer width="99%" minHeight={250}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={5}
                    >
                      {riskDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 0px 5px ${entry.color}80)` }} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#00f3ff40', borderRadius: '8px', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold font-mono text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">Risk</span>
                <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Matrix</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-4 px-2">
              {riskDistribution.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 5px ${item.color}` }}></div>
                    <span className="text-gray-300 text-xs">{item.name.replace(' Risk', '')}</span>
                  </div>
                  <span className="font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </CyberCard>
        </div>

        {/* Recent Alerts Table */}
        <CyberCard delay={0.7} className="p-0 overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-black/20">
            <h3 className="font-mono text-lg text-white font-bold tracking-wider">THREAT LOG</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-mono">
              <thead className="bg-cyan-900/10 text-cyan-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-normal">Alert ID</th>
                  <th className="px-6 py-4 font-normal">Timestamp</th>
                  <th className="px-6 py-4 font-normal">Target</th>
                  <th className="px-6 py-4 font-normal">Vector</th>
                  <th className="px-6 py-4 font-normal">Severity</th>
                  <th className="px-6 py-4 font-normal">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No active threats detected in the sector.</td>
                  </tr>
                ) : alerts.map((alert, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                    key={i} 
                    className="hover:bg-cyan-900/10 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-white">AL-{alert.id}</td>
                    <td className="px-6 py-4 text-gray-400">{new Date(alert.created_at).toLocaleTimeString()}</td>
                    <td className="px-6 py-4">{alert.transaction_id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 truncate max-w-xs">{alert.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded border text-xs tracking-wider ${
                        alert.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_5px_rgba(239,68,68,0.2)]' : 
                        alert.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 
                        alert.severity === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 'bg-green-500/10 text-green-400 border-green-500/30'
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/alerts/${alert.id}`} className="text-cyan-400 hover:text-cyan-300 transition-colors group-hover:underline flex items-center gap-1">
                        Inspect
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CyberCard>
      </div>
    </div>
  );
};

export default Dashboard;
