import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, AlertTriangle, Crosshair, MapPin, Cpu, Zap, Activity } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  amount: number;
  ip: string;
  device: string;
  country: string;
  decision: 'ALLOW' | 'BLOCK' | 'REVIEW';
  score: number;
}

const COUNTRIES = ['US', 'UK', 'RU', 'CN', 'BR', 'DE', 'JP', 'NG', 'IN', 'KR'];

const LiveFeed: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLive, setIsLive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLive && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, isLive]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const generateLog = () => {
      const rand = Math.random();
      let decision: 'ALLOW' | 'BLOCK' | 'REVIEW' = 'ALLOW';
      let score = rand * 0.3;
      
      if (rand > 0.85) {
        decision = 'BLOCK';
        score = 0.8 + (Math.random() * 0.2);
      } else if (rand > 0.75) {
        decision = 'REVIEW';
        score = 0.6 + (Math.random() * 0.2);
      }

      const newLog: LogEntry = {
        id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        amount: parseFloat((Math.random() * (decision === 'BLOCK' ? 50000 : 500)).toFixed(2)),
        ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        device: `DEV_${Math.floor(Math.random() * 9000) + 1000}`,
        country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
        decision,
        score
      };

      setLogs(prev => {
        const updated = [...prev, newLog];
        return updated.length > 50 ? updated.slice(updated.length - 50) : updated;
      });

      const nextDelay = Math.random() * 800 + 200; // 200ms - 1000ms
      timeoutId = setTimeout(generateLog, nextDelay);
    };

    if (isLive) {
      timeoutId = setTimeout(generateLog, 500);
    }

    return () => clearTimeout(timeoutId);
  }, [isLive]);

  return (
    <div className="min-h-screen bg-[#05050b] text-white p-4 md:p-8 flex flex-col h-screen overflow-hidden">
      <header className="mb-6 flex items-end justify-between shrink-0 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-900/20 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
              <Terminal className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-widest uppercase drop-shadow-[0_0_5px_rgba(0,243,255,0.3)]">
                Global Threat Stream
              </h2>
              <p className="text-xs font-mono text-cyan-500 tracking-widest uppercase mt-1">Real-time Neural Analysis Matrix</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4 font-mono text-[10px] text-gray-500 uppercase">
            <span>Protocol: WebSocket wss://</span>
            <span>Latency: 14ms</span>
          </div>
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-widest uppercase border transition-all shadow-lg ${
              isLive 
              ? 'bg-red-900/20 text-red-400 border-red-500/50 hover:bg-red-900/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
              : 'bg-green-900/20 text-green-400 border-green-500/50 hover:bg-green-900/40 shadow-[0_0_15px_rgba(74,222,128,0.2)]'
            }`}
          >
            {isLive ? <><Zap className="w-3.5 h-3.5" /> Pause Uplink</> : <><Activity className="w-3.5 h-3.5" /> Resume Uplink</>}
          </button>
          <div className="flex items-center gap-2 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse' : 'bg-gray-600'}`}></span>
            <span className="font-mono text-gray-300 tracking-widest">LIVE</span>
          </div>
        </div>
      </header>

      {/* Main Terminal Container */}
      <div className="flex-1 relative flex flex-col min-h-0 bg-[#0a0a14] border border-cyan-900/40 rounded-2xl shadow-[inset_0_0_50px_rgba(0,255,255,0.03)] overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        
        {/* Table Header */}
        <div className="flex items-center gap-4 p-4 border-b border-white/5 bg-black/40 text-[10px] font-mono text-gray-500 uppercase tracking-widest shrink-0">
          <div className="w-24">Timestamp</div>
          <div className="w-32">Risk Score</div>
          <div className="w-24">Location</div>
          <div className="w-32">IP Address</div>
          <div className="w-32">Device Sig</div>
          <div className="w-32">Volume</div>
          <div className="flex-1 text-right">AI Decision</div>
        </div>

        {/* Scrolling Log Area */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto p-4 custom-scrollbar relative z-10"
        >
          <div className="flex flex-col gap-1.5">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center gap-4 p-3 rounded-lg border-l-4 text-xs font-mono transition-all group ${
                    log.decision === 'BLOCK' 
                      ? 'border-red-500 bg-red-950/20 text-red-100 hover:bg-red-950/40' 
                      : log.decision === 'REVIEW'
                      ? 'border-yellow-500 bg-yellow-950/20 text-yellow-100 hover:bg-yellow-950/40'
                      : 'border-cyan-500/50 bg-black/30 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div className="w-24 text-gray-500 shrink-0">
                    {log.timestamp.split('T')[1].substring(0,12)}
                  </div>
                  
                  <div className="w-32 flex items-center gap-2 shrink-0">
                    <div className="w-16 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                      <div className={`h-full ${
                        log.score > 0.8 ? 'bg-red-500' : log.score > 0.6 ? 'bg-yellow-500' : 'bg-cyan-500'
                      }`} style={{ width: `${log.score * 100}%` }}></div>
                    </div>
                    <span className={log.score > 0.8 ? 'text-red-400 font-bold' : ''}>{(log.score * 100).toFixed(0)}</span>
                  </div>

                  <div className="w-24 flex items-center gap-1.5 shrink-0">
                    <MapPin className="w-3 h-3 opacity-50" />
                    {log.country}
                  </div>

                  <div className="w-32 shrink-0">
                    {log.ip}
                  </div>

                  <div className="w-32 shrink-0 text-gray-500">
                    {log.device}
                  </div>

                  <div className="w-32 shrink-0 font-bold text-white">
                    ${log.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </div>

                  <div className="flex-1 flex justify-end shrink-0">
                    {log.decision === 'BLOCK' ? (
                      <div className="flex items-center gap-2 text-red-400 font-bold tracking-widest bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-md shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                        <Crosshair className="w-3.5 h-3.5" /> BLOCKED
                      </div>
                    ) : log.decision === 'REVIEW' ? (
                      <div className="flex items-center gap-2 text-yellow-400 font-bold tracking-widest bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-md">
                        <AlertTriangle className="w-3.5 h-3.5" /> REVIEW
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-400 font-bold tracking-widest bg-green-500/5 border border-green-500/20 px-3 py-1.5 rounded-md">
                        <Shield className="w-3.5 h-3.5 opacity-70" /> CLEARED
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Overlay Gradients to smooth scroll top/bottom */}
        <div className="absolute top-12 left-0 w-full h-8 bg-gradient-to-b from-[#0a0a14] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#0a0a14] to-transparent z-20 pointer-events-none flex items-end justify-center pb-2">
          {isLive && (
            <div className="flex items-center gap-2 text-cyan-500/50 text-[10px] font-mono tracking-widest uppercase animate-pulse">
              <Cpu className="w-3 h-3" /> Processing Neural Stream
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
