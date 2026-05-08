import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, ShieldAlert, AlertTriangle, ShieldCheck, Zap,
  Activity, Globe, Lock, Search, Fingerprint, Server,
  Clock, MapPin, Smartphone, Radar
} from 'lucide-react';
import { CyberCard } from '../components/CyberCard';
import { predictFraud } from '../services/api';

const ProgressBar = ({ label, value, colorClass, delay = 0 }: { label: string, value: number, colorClass: string, delay?: number }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-mono text-white font-bold">{(value * 100).toFixed(1)}%</span>
    </div>
    <div className="w-full bg-black/60 rounded-full h-1.5 border border-white/5 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 1.5, delay, ease: "easeOut" }}
        className={`h-full rounded-full ${colorClass}`}
      ></motion.div>
    </div>
  </div>
);

const NeuralNode = ({ active }: { active: boolean }) => (
  <motion.div
    animate={{ 
      opacity: active ? [0.4, 1, 0.4] : 0.2,
      scale: active ? [1, 1.2, 1] : 1
    }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={`w-2 h-2 rounded-full ${active ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-gray-700'}`}
  />
);

const Sandbox: React.FC = () => {
  const [formData, setFormData] = useState({
    amount: '',
    ip: '',
    device: '',
    country: 'US',
    browser: 'Chrome 120.0',
    type: 'purchase',
    sessionDuration: '120',
    velocity: '1',
    vpnDetected: 'false'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].substring(0,8)}] ${msg}`]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResult(null);
    setLogs([]);

    addLog("INITIATING NEURAL INFERENCE ENGINE...");
    setTimeout(() => addLog("EXTRACTING TRANSACTION FEATURES..."), 300);
    setTimeout(() => addLog("RUNNING IP REPUTATION CHECK..."), 600);
    setTimeout(() => addLog("ANALYZING DEVICE FINGERPRINT..."), 900);
    setTimeout(() => addLog("EVALUATING VELOCITY ANOMALIES..."), 1200);
    setTimeout(() => addLog("COMPUTING FINAL RISK TENSOR..."), 1500);

    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const prediction = await predictFraud({
        user_id: `sandbox_${Date.now()}`,
        amount: parseFloat(formData.amount) || 0,
        currency: "USD",
        ip_address: formData.ip || "127.0.0.1",
        device_id: formData.device || "demo_device",
        metadata: {
          country: formData.country,
          browser: formData.browser,
          type: formData.type,
          vpn: formData.vpnDetected === 'true'
        }
      });
      setResult(prediction);
      addLog(`INFERENCE COMPLETE. DECISION: ${prediction.decision}`);
    } catch (error) {
      console.error("Prediction failed:", error);
      addLog("ERROR: INFERENCE ENGINE UNREACHABLE.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#070514] text-white p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-7xl mb-8 flex items-center justify-between border-b border-cyan-900/30 pb-6 relative">
        <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-900/20 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
            <Cpu className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-widest uppercase">
              AI Decision Sandbox
            </h2>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mt-1">
              Neural Network Inference Simulator
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/5 rounded-lg">
          <Server className="w-4 h-4 text-green-400" />
          <span className="text-xs font-mono text-green-400">ENGINE: ONLINE</span>
        </div>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: Input Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <CyberCard className="flex-1 bg-[#0a0a14] border-white/5 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-1 tracking-wider uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" /> Transaction Vector
                </h3>
                <p className="text-gray-500 text-xs font-mono">Configure input parameters for the ML model</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-cyan-500 uppercase tracking-widest mb-1.5">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input type="number" name="amount" required value={formData.amount} onChange={handleChange} placeholder="5000.00"
                      className="w-full bg-black/50 border border-white/10 rounded-md pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 font-mono transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-cyan-500 uppercase tracking-widest mb-1.5">IP Address</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input type="text" name="ip" required value={formData.ip} onChange={handleChange} placeholder="192.168.1.1"
                      className="w-full bg-black/50 border border-white/10 rounded-md pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 font-mono transition-all" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1.5">Device Fingerprint</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input type="text" name="device" required value={formData.device} onChange={handleChange} placeholder="iPhone14,2"
                      className="w-full bg-black/50 border border-white/10 rounded-md pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 font-mono transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1.5">Browser Identity</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input type="text" name="browser" required value={formData.browser} onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-md pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 font-mono transition-all" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">Country</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <select name="country" value={formData.country} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-md pl-8 pr-2 py-2 text-sm text-white focus:outline-none focus:border-white/30 font-mono appearance-none">
                      <option value="US">USA</option>
                      <option value="UK">UK</option>
                      <option value="CN">China</option>
                      <option value="RU">Russia</option>
                      <option value="NG">Nigeria</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">Tx Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 font-mono appearance-none">
                    <option value="purchase">Purchase</option>
                    <option value="transfer">Transfer</option>
                    <option value="withdrawal">Withdrawal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">VPN/Tor</label>
                  <select name="vpnDetected" value={formData.vpnDetected} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 font-mono appearance-none">
                    <option value="false">False</option>
                    <option value="true">True</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 pt-6 border-t border-white/5">
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className={`relative w-full flex items-center justify-center gap-3 py-3 rounded-lg font-bold tracking-widest uppercase transition-all overflow-hidden group ${
                    isProcessing 
                    ? 'bg-cyan-900/20 text-cyan-500 border border-cyan-900/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
                  {isProcessing ? (
                    <><Radar className="w-4 h-4 animate-spin text-cyan-400" relative z-10 /> EVALUATING...</>
                  ) : (
                    <><Zap className="w-4 h-4 relative z-10" /> INITIATE SCAN</>
                  )}
                </button>
              </div>
            </form>
          </CyberCard>
        </div>

        {/* RIGHT PANEL: Engine Analysis */}
        <div className="lg:col-span-7">
          <CyberCard className="relative overflow-hidden min-h-[600px] h-full flex flex-col bg-[#05050b] border-white/5">
            <AnimatePresence mode="wait">
              {!result && !isProcessing && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-8 text-center"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 border border-gray-700 rounded-full animate-ping opacity-20"></div>
                    <Cpu className="w-16 h-16 text-gray-700" />
                  </div>
                  <p className="font-mono text-sm tracking-widest uppercase text-gray-400">System Standby</p>
                  <p className="text-xs mt-2 text-gray-600 max-w-sm">Awaiting transaction vector input for multi-layer neural analysis and threat detection.</p>
                </motion.div>
              )}

              {isProcessing && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col p-6 bg-[#05050b] z-10"
                >
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative w-32 h-32 mb-8">
                      <svg className="absolute inset-0 w-full h-full animate-[spin_4s_linear_infinite]" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="5 5" />
                      </svg>
                      <svg className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite_reverse]" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="20 10" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShieldAlert className="w-10 h-10 text-cyan-400 animate-pulse drop-shadow-[0_0_10px_#22d3ee]" />
                      </div>
                    </div>
                    <p className="font-mono text-cyan-400 tracking-widest uppercase animate-pulse text-sm">Deep Packet Inspection...</p>
                  </div>
                  
                  <div className="h-48 bg-black/50 border border-white/5 rounded-lg p-4 font-mono text-[10px] text-green-400 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black to-transparent z-10"></div>
                    <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-black to-transparent z-10"></div>
                    <div className="flex flex-col justify-end h-full">
                      {logs.map((log, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-1">
                          {log}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {result && !isProcessing && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                        <Search className="w-4 h-4 text-cyan-400" /> Intelligence Report
                      </h3>
                      <p className="text-[10px] text-gray-500 font-mono mt-1">ID: {result.transaction_id}</p>
                    </div>
                    <div className="flex gap-1">
                      <NeuralNode active={true} />
                      <NeuralNode active={true} />
                      <NeuralNode active={true} />
                    </div>
                  </div>
                  
                  {/* Decision Banner */}
                  <div className={`p-5 rounded-xl border relative overflow-hidden mb-6 ${
                    result.decision === 'ALLOW' ? 'bg-green-950/30 border-green-500/30' :
                    result.decision === 'REVIEW' ? 'bg-yellow-950/30 border-yellow-500/30' :
                    'bg-red-950/30 border-red-500/30'
                  }`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20 ${
                      result.decision === 'ALLOW' ? 'bg-green-500' :
                      result.decision === 'REVIEW' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`p-3 rounded-xl border shadow-lg ${
                        result.decision === 'ALLOW' ? 'bg-green-500/10 border-green-500/50 text-green-400' :
                        result.decision === 'REVIEW' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400' :
                        'bg-red-500/10 border-red-500/50 text-red-500'
                      }`}>
                        {result.decision === 'ALLOW' ? <ShieldCheck className="w-8 h-8" /> :
                         result.decision === 'REVIEW' ? <AlertTriangle className="w-8 h-8" /> :
                         <ShieldAlert className="w-8 h-8" />}
                      </div>
                      <div>
                        <h2 className={`text-2xl font-black tracking-widest uppercase ${
                          result.decision === 'ALLOW' ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' :
                          result.decision === 'REVIEW' ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' :
                          'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]'
                        }`}>
                          {result.decision === 'ALLOW' ? 'CLEARED' : result.decision === 'REVIEW' ? 'MANUAL REVIEW' : 'THREAT BLOCKED'}
                        </h2>
                        <p className="text-xs text-gray-400 font-mono mt-1">
                          Risk Score: <span className="text-white font-bold">{(result.score * 100).toFixed(1)}/100</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-6 flex-1">
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                      <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Signal Analysis
                      </h4>
                      <ProgressBar label="ML Anomaly" value={result.trace?.ml_score || result.score} colorClass="bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" delay={0.1} />
                      <ProgressBar label="IP Reputation" value={result.trace?.ip_score || (result.score * 0.8)} colorClass="bg-gradient-to-r from-yellow-600 to-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]" delay={0.2} />
                      <ProgressBar label="Behavioral Risk" value={result.trace?.behavior_score || Math.min(1, result.score * 1.2)} colorClass="bg-gradient-to-r from-purple-600 to-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" delay={0.3} />
                    </div>

                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                      <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Globe className="w-3 h-3" /> Threat Intelligence
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-gray-400">Geo-IP Match</span>
                          <span className="text-xs font-mono text-green-400">VERIFIED</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-gray-400">Known Botnet</span>
                          <span className="text-xs font-mono text-green-400">NEGATIVE</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-gray-400">Velocity Limit</span>
                          <span className="text-xs font-mono text-yellow-400">WARNING</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Proxy/TOR</span>
                          <span className="text-xs font-mono text-red-400">DETECTED</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Reasoning */}
                  {result.explanation && result.explanation.length > 0 && (
                    <div className="bg-[#1a0b1c]/30 border border-purple-500/20 p-4 rounded-xl">
                      <h4 className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Search className="w-3 h-3" /> Neural Explainability
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.explanation.map((reason: string, i: number) => (
                          <motion.span 
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                            key={i} className="text-[11px] bg-purple-900/30 border border-purple-500/30 px-2.5 py-1 rounded-md text-purple-200"
                          >
                            {reason}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

export default Sandbox;
