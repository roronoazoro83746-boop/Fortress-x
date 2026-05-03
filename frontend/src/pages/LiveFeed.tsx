import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, AlertTriangle } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  amount: number;
  ip: string;
  device: string;
  decision: 'ALLOW' | 'BLOCK';
}

const LiveFeed: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  // Generate mock stream
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const generateLog = () => {
      const isFraud = Math.random() < 0.20; // 20% fraud probability
      const newLog: LogEntry = {
        id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        amount: parseFloat((Math.random() * 5000).toFixed(2)),
        ip: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        device: `DEV_${Math.floor(Math.random() * 9000) + 1000}`,
        decision: isFraud ? 'BLOCK' : 'ALLOW'
      };

      setLogs(prev => {
        const updated = [...prev, newLog];
        // Keep max 100 logs in memory to prevent DOM lag
        return updated.length > 100 ? updated.slice(updated.length - 100) : updated;
      });

      const nextDelay = Math.random() * 1000 + 500; // 500ms - 1500ms
      timeoutId = setTimeout(generateLog, nextDelay);
    };

    // Initial sequence
    timeoutId = setTimeout(generateLog, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-cyan-400 font-mono p-4 md:p-8 flex flex-col h-screen">
      <header className="mb-4 border-b border-cyan-900/50 pb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Terminal className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
            Global Threat Stream
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-900/20 border border-cyan-500/50 rounded-md text-xs shadow-[0_0_10px_rgba(0,243,255,0.2)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_5px_rgba(0,243,255,1)]"></span>
          <span className="hidden md:inline">Uplink Established</span>
          <span className="md:hidden">Live</span>
        </div>
      </header>

      <div 
        ref={containerRef}
        className="flex-1 bg-black/80 border border-cyan-900/50 rounded-lg p-4 overflow-y-auto shadow-[inset_0_0_30px_rgba(0,255,255,0.05)] relative"
      >
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none"></div>
        <div className="flex flex-col gap-2 relative z-0">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-3 rounded border-l-2 text-sm ${
                  log.decision === 'BLOCK' 
                    ? 'border-red-500 bg-red-950/40 text-red-300' 
                    : 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                }`}
              >
                <div className="w-full md:w-56 text-gray-500 text-xs shrink-0 whitespace-nowrap">
                  [{log.timestamp.replace('T', ' ').replace('Z', '')}]
                </div>
                <div className="w-full md:w-32 shrink-0 tracking-wider">
                  IP: <span className="text-white">{log.ip}</span>
                </div>
                <div className="w-full md:w-32 shrink-0">
                  ID: <span className="text-white">{log.device}</span>
                </div>
                <div className="w-full md:w-32 shrink-0 font-bold text-white">
                  ${log.amount.toFixed(2)}
                </div>
                <div className="flex-1 flex md:justify-end shrink-0">
                  {log.decision === 'BLOCK' ? (
                    <div className="flex items-center gap-2 text-red-500 font-bold tracking-widest bg-red-900/40 px-3 py-1 rounded shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                      <AlertTriangle className="w-4 h-4" /> THREAT DETECTED
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400 font-bold tracking-widest bg-green-900/40 px-3 py-1 rounded shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                      <Shield className="w-4 h-4" /> CLEARED
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
