import React, { useState } from 'react';
import { predictFraud } from '../services/api';
import type { PredictionResponse, TransactionData } from '../services/api';

const FraudDetection: React.FC = () => {
  const [formData, setFormData] = useState<TransactionData>({
    user_id: 'user_trial_88x',
    amount: 0,
    currency: 'USD',
    ip_address: '',
    device_id: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const resp = await predictFraud(formData);
      setResult(resp);
    } catch (err: any) {
      setError(err.message || 'Analysis Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-[#0e0e0e]">
      <header className="mb-12 text-center md:text-left">
        <h2 className="text-3xl font-bold font-heading text-white tracking-tight">Fraud Analysis Engine</h2>
        <p className="text-gray-500 mt-2">Evaluate specific transactions using the Sentinel AI orchestration.</p>
      </header>

      <div className="grid grid-cols-1 gap-10">
        {/* Input Form Card */}
        <div className="bg-[#151921] border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-cyan-400/10 transition-all"></div>
          
          <h3 className="font-heading font-semibold text-xl mb-8 flex items-center gap-3 text-white">
            <span className="material-symbols-outlined text-cyan-400">query_stats</span> Transaction Parameters
          </h3>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-gray-400 font-bold px-1">Amount (USD)</label>
                <input 
                  type="number" 
                  name="amount"
                  required
                  value={formData.amount || ''}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-cyan-400 transition-all outline-none font-mono text-lg" 
                  placeholder="0.00" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-gray-400 font-bold px-1">IP Address</label>
                <input 
                  type="text" 
                  name="ip_address"
                  required
                  value={formData.ip_address}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-cyan-400 transition-all outline-none font-mono" 
                  placeholder="8.8.8.8" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-gray-400 font-bold px-1">Device Identifier</label>
              <input 
                type="text" 
                name="device_id"
                required
                value={formData.device_id}
                onChange={handleChange}
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-cyan-400 transition-all outline-none" 
                placeholder="DEV-SENTINEL-X" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-cyan-400 text-black font-bold rounded-xl hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
            >
              {loading ? (
                <>
                  <span className="animate-spin material-symbols-outlined">sync</span>
                  <span className="font-heading uppercase tracking-widest">Orchestrating AI Engines...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">analytics</span>
                  <span className="font-heading uppercase tracking-widest">Execute Fraud Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {error && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-mono text-sm animate-in fade-in zoom-in-95">
            <span className="material-symbols-outlined align-middle mr-2">error</span>
            {error}
          </div>
        )}

        {result && (
          <div className="bg-[#151921] border border-white/5 p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-5">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-8">
              <div className="text-center md:text-left">
                <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Calculated Risk Score</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-6xl font-bold font-heading ${
                    result.score > 0.7 ? 'text-red-500' : result.score > 0.4 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {(result.score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className={`px-10 py-5 rounded-2xl border-2 flex flex-col items-center justify-center ${
                result.decision === 'BLOCK' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                result.decision === 'REVIEW' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' :
                'bg-green-500/10 border-green-500/30 text-green-500'
              }`}>
                <span className="text-xs font-mono uppercase tracking-widest font-bold mb-1">Final Verdict</span>
                <span className="text-4xl font-black font-heading tracking-widest italic">{result.decision}</span>
              </div>
            </div>

            <div className="w-full bg-black/40 h-3 rounded-full mb-10 overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  result.score > 0.7 ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 
                  result.score > 0.4 ? 'bg-yellow-400 shadow-[0_0_15px_#facc15]' : 
                  'bg-green-400 shadow-[0_0_15px_#4ade80]'
                }`}
                style={{ width: `${result.score * 100}%` }}
              ></div>
            </div>

            <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
              <h4 className="font-heading font-semibold text-lg text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-500">info</span> Risk Explanation
              </h4>
              <ul className="space-y-4">
                {result.explanation.map((reason, i) => (
                  <li key={i} className="flex gap-4 text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <button className="py-3 px-4 glass rounded-xl text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">Dismiss Case</button>
              <button className="py-3 px-4 glass rounded-xl text-xs font-bold uppercase tracking-widest text-red-400 border-red-400/20 hover:bg-red-400/10 transition-all">Freeze Account</button>
              <button className="py-3 px-4 glass rounded-xl text-xs font-bold uppercase tracking-widest text-cyan-400 border-cyan-400/20 hover:bg-cyan-400/10 transition-all">Export Trace</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudDetection;
