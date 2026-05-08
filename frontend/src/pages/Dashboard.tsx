import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Bell, ChevronDown, Activity, AlertTriangle, ShieldCheck, Zap, Crosshair, Network, Cpu, Lock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDashboardMetrics, getAlerts, API_BASE_URL, predictFraud } from '../services/api';
import { CyberCard } from '../components/CyberCard';
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

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);

    const wsBaseUrl = import.meta.env.VITE_WS_URL || API_BASE_URL.replace(/^http/, 'ws');
    const wsUrl = `${wsBaseUrl}/ws/dashboard`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "dashboard_update") {
          setMetrics((prev: any) => prev ? { ...prev, ...data.metrics } : data.metrics);
          if (data.alerts && data.alerts.length > 0) {
            setAlerts(data.alerts);
          }
        }
      } catch (e) {
        console.error("Error parsing WS message", e);
      }
    };

    ws.onclose = () => {
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
        const payload = {
          user_id: `user_${Math.floor(Math.random() * 1000)}`,
          amount: Math.random() > 0.8 ? Math.random() * 50000 : Math.random() * 100,
          currency: "USD",
          ip_address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.1.1`,
          device_id: `device_${Math.floor(Math.random() * 1000)}`
        };
        promises.push(predictFraud(payload).catch(e => console.warn(e)));
      }
      await Promise.all(promises);
      await fetchDashboardData();
    } finally {
      setIsSimulating(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="flex h-screen bg-[#05050b] items-center justify-center text-cyan-400">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-b-2 border-purple-500 animate-[spin_2s_linear_infinite_reverse]"></div>
          <ShieldCheck className="absolute inset-0 m-auto w-10 h-10 text-cyan-400 animate-pulse" />
        </div>
      </div>
    );
  }

  const { totalScans, fraudBlocked, avgRiskScore, activeAlerts, riskTrend, riskDistribution } = metrics;

  // Mock data for radar
  const radarData = [
    { subject: 'Velocity', A: 120, fullMark: 150 },
    { subject: 'IP Trust', A: 98, fullMark: 150 },
    { subject: 'Location', A: 86, fullMark: 150 },
    { subject: 'Device', A: 99, fullMark: 150 },
    { subject: 'Amount', A: 85, fullMark: 150 },
    { subject: 'Behavior', A: 65, fullMark: 150 },
  ];

  return (
    <div className="relative min-h-screen bg-transparent text-white font-sans overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-scrollbar">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Top Header */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-6 border-b border-white/5 pb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent"></div>
              <Network className="w-7 h-7 text-cyan-400 relative z-10" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-gray-400 tracking-wider">
                SOC COMMAND CENTER
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> SYSTEM ACTIVE
                </span>
                <span className="text-white/20">|</span>
                <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">ID: 4X-99 ALPHA</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <button 
              onClick={handleSimulateFraud} disabled={isSimulating}
              className={`flex-1 xl:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 relative overflow-hidden group ${
                isSimulating 
                ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30 cursor-wait'
                : 'bg-[#0a0a14] border border-purple-500/50 hover:border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              {isSimulating ? (
                <span className="flex items-center gap-2 relative z-10"><Zap className="w-4 h-4 animate-spin" /> SIMULATING...</span>
              ) : (
                <span className="flex items-center gap-2 relative z-10"><Crosshair className="w-4 h-4" /> INJECT THREATS</span>
              )}
            </button>

            <div className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-mono transition-all ${wsConnected ? 'bg-cyan-950/30 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'bg-black/40 text-gray-400 border-white/10'}`}>
              <div className="relative flex h-2 w-2">
                {wsConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${wsConnected ? 'bg-cyan-500' : 'bg-gray-500'}`}></span>
              </div>
              {wsConnected ? 'UPLINK STABLE' : 'CONNECTING...'}
            </div>
            
            <Link to="/alerts" className="relative p-2.5 bg-black/40 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-colors group">
              <Bell className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
              {activeAlerts > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#05050b] text-[8px] flex items-center justify-center font-bold">{activeAlerts}</span>}
            </Link>
          </motion.div>
        </header>

        {/* Global Stats Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Transactions Analyzed', value: totalScans.toLocaleString(), icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
            { label: 'Threats Neutralized', value: fraudBlocked.toLocaleString(), icon: ShieldCheck, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
            { label: 'Network Risk Score', value: `${avgRiskScore}%`, icon: AlertTriangle, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
            { label: 'Engine Status', value: 'OPTIMAL', icon: Cpu, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
          ].map((stat, i) => (
            <CyberCard key={i} delay={0.1 * i} className={`p-5 flex items-center justify-between border ${stat.border} hover:bg-white/[0.02] transition-colors group cursor-default`}>
              <div>
                <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1">{stat.label}</p>
                <p className={`text-3xl font-black ${stat.color} drop-shadow-[0_0_10px_currentColor] tracking-tight`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </CyberCard>
          ))}
        </div>

        {/* Neural Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          
          {/* Main Area Chart */}
          <CyberCard delay={0.5} className="lg:col-span-8 p-0 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h3 className="font-mono text-xs text-white font-bold tracking-widest uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Neural Inference Volume
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400"><div className="w-2 h-2 bg-cyan-400 rounded-sm"></div> Traffic</div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400"><div className="w-2 h-2 bg-red-500 rounded-sm"></div> Blocked</div>
              </div>
            </div>
            <div className="h-[320px] w-full p-4 pb-0 bg-gradient-to-b from-transparent to-cyan-900/5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#05050b', borderColor: '#22d3ee40', borderRadius: '8px', color: '#fff', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
                    itemStyle={{ fontFamily: 'monospace', fontSize: '12px' }}
                    labelStyle={{ color: '#6b7280', fontFamily: 'monospace', fontSize: '10px', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                  <Area type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorFraud)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CyberCard>

          {/* Radar Chart */}
          <CyberCard delay={0.6} className="lg:col-span-4 p-0 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/5 bg-white/[0.01]">
              <h3 className="font-mono text-xs text-white font-bold tracking-widest uppercase flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" /> AI Threat Vectors
              </h3>
            </div>
            <div className="flex-1 flex items-center justify-center relative p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent">
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace' }} />
                  <Radar name="Threat Vector" dataKey="A" stroke="#a855f7" strokeWidth={2} fill="#a855f7" fillOpacity={0.4} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#05050b', borderColor: '#a855f740', borderRadius: '8px', fontSize: '10px', fontFamily: 'monospace' }} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 pointer-events-none border-[1px] border-purple-500/10 rounded-full scale-75 animate-ping opacity-20"></div>
            </div>
          </CyberCard>
        </div>

        {/* Lower Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Donut Chart */}
          <CyberCard delay={0.7} className="p-0 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/5 bg-white/[0.01]">
              <h3 className="font-mono text-xs text-white font-bold tracking-widest uppercase flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-green-400" /> Risk Distribution
              </h3>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="h-[180px] w-full relative mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                      {riskDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 0px 8px ${entry.color}80)` }} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#05050b', borderColor: '#ffffff20', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black font-mono text-white">{(riskDistribution[0]?.value || 0).toFixed(0)}%</span>
                  <span className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">Low Risk</span>
                </div>
              </div>
              <div className="space-y-2.5 mt-auto">
                {riskDistribution.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}></div>
                      <span className="text-gray-400 uppercase">{item.name}</span>
                    </div>
                    <span className="font-bold text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CyberCard>

          {/* Incident Log */}
          <CyberCard delay={0.8} className="lg:col-span-2 p-0 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
              <h3 className="font-mono text-xs text-white font-bold tracking-widest uppercase flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400" /> Active Threat Log
              </h3>
              <Link to="/alerts" className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest uppercase flex items-center gap-1">
                View All <Eye className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/[0.02] text-gray-500 border-b border-white/5">
                  <tr>
                    <th className="px-5 py-3 font-medium uppercase tracking-widest">Incident ID</th>
                    <th className="px-5 py-3 font-medium uppercase tracking-widest">Time</th>
                    <th className="px-5 py-3 font-medium uppercase tracking-widest">Target Vector</th>
                    <th className="px-5 py-3 font-medium uppercase tracking-widest">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {alerts.length === 0 ? (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-600">No active threats detected.</td></tr>
                  ) : alerts.map((alert, i) => (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + (i * 0.05) }} key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <td className="px-5 py-3.5 font-bold text-gray-300">AL-{alert.id}</td>
                      <td className="px-5 py-3.5 text-gray-500">{new Date(alert.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</td>
                      <td className="px-5 py-3.5 text-cyan-400 truncate max-w-[200px]">{alert.reason}</td>
                      <td className="px-5 py-3.5">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold tracking-widest border ${
                          alert.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 
                          alert.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${alert.severity === 'CRITICAL' ? 'bg-red-500' : alert.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                          {alert.severity}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

// Missing Icons import fallback (Target, PieChartIcon)
import { Target, PieChart as PieChartIcon } from 'lucide-react';

export default Dashboard;
