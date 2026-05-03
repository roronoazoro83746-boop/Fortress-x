import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ShieldAlert, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { CyberCard } from '../components/CyberCard';
import { predictFraud } from '../services/api';

const ProgressBar = ({ label, value, colorClass }: { label: string, value: number, colorClass: string }) => (
  <div className="mb-6">
    <div className="flex justify-between mb-2">
      <span className="text-xs font-mono text-gray-300 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-mono text-white font-bold">{(value * 100).toFixed(1)}%</span>
    </div>
    <div className="w-full bg-black/50 rounded-full h-3 border border-white/10 overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`h-full rounded-full ${colorClass}`}
      ></motion.div>
    </div>
  </div>
);

const Sandbox: React.FC = () => {
  const [formData, setFormData] = useState({
    amount: '',
    ip: '',
    device: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResult(null);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const prediction = await predictFraud({
        user_id: `demo_${Date.now()}`,
        amount: parseFloat(formData.amount) || 0,
        currency: "USD",
        ip_address: formData.ip || "127.0.0.1",
        device_id: formData.device || "demo_device"
      });
      setResult(prediction);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-8 flex items-center justify-between border-b border-purple-500/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-900/40 rounded-lg border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Cpu className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-wider">
            AI Decision Sandbox
          </h2>
        </div>
      </header>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <CyberCard className="flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-2 tracking-wider">Transaction Parameters</h3>
            <p className="text-gray-400 text-sm">Input data to see how the Fortress X neural network evaluates risk.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase tracking-widest mb-2">Amount (USD)</label>
              <input 
                type="number" 
                name="amount"
                required
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 5000.00"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 font-mono transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase tracking-widest mb-2">IP Address</label>
              <input 
                type="text" 
                name="ip"
                required
                value={formData.ip}
                onChange={handleChange}
                placeholder="e.g. 192.168.1.1"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 font-mono transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase tracking-widest mb-2">Device Signature</label>
              <input 
                type="text" 
                name="device"
                required
                value={formData.device}
                onChange={handleChange}
                placeholder="e.g. iPhone14,2"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 font-mono transition-all"
              />
            </div>
            
            <div className="mt-auto pt-6">
              <button 
                type="submit" 
                disabled={isProcessing}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold tracking-wider uppercase transition-all ${
                  isProcessing 
                  ? 'bg-purple-900/50 text-purple-400 border border-purple-500/30 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                }`}
              >
                {isProcessing ? (
                  <><Zap className="w-5 h-5 animate-pulse" /> Evaluating Matrix...</>
                ) : (
                  <><Cpu className="w-5 h-5" /> Run Inference</>
                )}
              </button>
            </div>
          </form>
        </CyberCard>

        {/* Results Panel */}
        <CyberCard className="relative overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            {!result && !isProcessing && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-8 text-center"
              >
                <Cpu className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-mono text-sm tracking-widest uppercase">Awaiting Data Input</p>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10"
              >
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-b-2 border-purple-500 animate-spin animation-delay-200"></div>
                  <Cpu className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse" />
                </div>
                <p className="font-mono text-cyan-400 tracking-widest uppercase animate-pulse">Running Neural Models...</p>
              </motion.div>
            )}

            {result && !isProcessing && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col"
              >
                <h3 className="text-lg font-bold text-white mb-6 tracking-wider">Engine Analysis</h3>
                
                <div className="flex-1">
                  <ProgressBar 
                    label="Machine Learning Confidence" 
                    value={result.trace?.ml_score || result.score} 
                    colorClass="bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.8)]" 
                  />
                  <ProgressBar 
                    label="IP Reputation Risk" 
                    value={result.trace?.ip_score || (result.score * 0.8)} 
                    colorClass="bg-gradient-to-r from-yellow-500 to-orange-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]" 
                  />
                  <ProgressBar 
                    label="Behavioral Anomaly" 
                    value={result.trace?.behavior_score || (result.score * 1.2 > 1 ? 1 : result.score * 1.2)} 
                    colorClass="bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" 
                  />
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">Final Decision Matrix</h4>
                  
                  {result.decision === 'ALLOW' && (
                    <div className="flex items-center gap-4 bg-green-900/20 border border-green-500/50 p-4 rounded-xl">
                      <div className="p-3 bg-green-500/20 rounded-full">
                        <ShieldCheck className="w-8 h-8 text-green-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-green-400 tracking-wider">TRANSACTION APPROVED</h2>
                        <p className="text-sm text-gray-400">Low risk profile detected. Safe to proceed.</p>
                      </div>
                    </div>
                  )}

                  {result.decision === 'REVIEW' && (
                    <div className="flex items-center gap-4 bg-yellow-900/20 border border-yellow-500/50 p-4 rounded-xl">
                      <div className="p-3 bg-yellow-500/20 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-yellow-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-yellow-400 tracking-wider">MANUAL REVIEW REQUIRED</h2>
                        <p className="text-sm text-gray-400">Suspicious patterns detected. Analyst intervention requested.</p>
                      </div>
                    </div>
                  )}

                  {result.decision === 'BLOCK' && (
                    <div className="flex items-center gap-4 bg-red-900/20 border border-red-500/50 p-4 rounded-xl">
                      <div className="p-3 bg-red-500/20 rounded-full">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-red-500 tracking-wider">THREAT BLOCKED</h2>
                        <p className="text-sm text-gray-400">Critical risk threshold exceeded.</p>
                      </div>
                    </div>
                  )}

                  {result.explanation && result.explanation.length > 0 && (
                    <div className="mt-4 bg-black/40 p-3 rounded-lg border border-white/5">
                      <p className="text-xs font-mono text-gray-500 mb-1">Reasoning Flags:</p>
                      <div className="flex flex-wrap gap-2">
                        {result.explanation.map((reason: string, i: number) => (
                          <span key={i} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CyberCard>
      </div>
    </div>
  );
};

export default Sandbox;
