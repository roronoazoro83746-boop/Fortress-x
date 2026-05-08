import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Search, Filter, Download, ChevronDown, ChevronUp, 
  ShieldCheck, ShieldAlert, AlertTriangle, Activity, MapPin, Smartphone
} from 'lucide-react';
import { CyberCard } from '../components/CyberCard';
import { getTransactions } from '../services/api';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const data = await getTransactions(0, 50);
        setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, []);

  const filteredTx = transactions.filter(tx => 
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.ip_address?.includes(searchTerm) ||
    tx.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#05050b] text-white p-4 md:p-8 flex flex-col h-screen overflow-hidden">
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between shrink-0 relative z-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-900/20 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
            <CreditCard className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-widest uppercase">
              Transaction Ledger
            </h2>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mt-1">
              Global Payment Network Monitoring
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search ID, IP, User..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <button className="p-2.5 bg-black/40 border border-white/10 rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2.5 bg-black/40 border border-white/10 rounded-lg text-gray-400 hover:text-purple-400 hover:border-purple-500/30 transition-all">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 relative flex flex-col min-h-0">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 border-t-2 border-b-2 border-cyan-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <CyberCard className="flex-1 p-0 overflow-hidden flex flex-col bg-[#0a0a14] border-white/5">
            <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left text-xs font-mono whitespace-nowrap">
                <thead className="bg-white/[0.02] text-gray-500 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-5 py-3 font-medium uppercase tracking-widest">Transaction ID</th>
                    <th className="px-5 py-3 font-medium uppercase tracking-widest">Timestamp</th>
                    <th className="px-5 py-3 font-medium uppercase tracking-widest">Amount</th>
                    <th className="px-5 py-3 font-medium uppercase tracking-widest">User ID</th>
                    <th className="px-5 py-3 font-medium uppercase tracking-widest">Risk Score</th>
                    <th className="px-5 py-3 font-medium uppercase tracking-widest">Status</th>
                    <th className="px-5 py-3 font-medium uppercase tracking-widest w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTx.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-600">No transactions match your search.</td></tr>
                  ) : filteredTx.map((tx, i) => {
                    const isExpanded = expandedId === tx.id;
                    const finalScore = tx.score?.final_score || 0;
                    
                    return (
                      <React.Fragment key={tx.id}>
                        <motion.tr 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                          onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                          className={`hover:bg-white/[0.02] transition-colors cursor-pointer group ${isExpanded ? 'bg-white/[0.02]' : ''}`}
                        >
                          <td className="px-5 py-3.5 font-bold text-gray-300">TX-{tx.id.substring(0,8).toUpperCase()}</td>
                          <td className="px-5 py-3.5 text-gray-500">{new Date(tx.timestamp).toLocaleString()}</td>
                          <td className="px-5 py-3.5 font-bold text-white">${tx.amount?.toFixed(2)}</td>
                          <td className="px-5 py-3.5 text-gray-400">{tx.user_id}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-black/50 rounded-full overflow-hidden">
                                <div className={`h-full ${finalScore > 0.8 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : finalScore > 0.6 ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'}`} style={{ width: `${Math.max(5, finalScore * 100)}%` }}></div>
                              </div>
                              <span className={finalScore > 0.8 ? 'text-red-400 font-bold' : 'text-gray-400'}>{(finalScore * 100).toFixed(0)}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            {finalScore > 0.8 ? (
                              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold tracking-widest border bg-red-500/10 text-red-400 border-red-500/30">
                                <ShieldAlert className="w-3 h-3" /> BLOCKED
                              </div>
                            ) : finalScore > 0.6 ? (
                              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold tracking-widest border bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                                <AlertTriangle className="w-3 h-3" /> REVIEW
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold tracking-widest border bg-green-500/5 text-green-400 border-green-500/20">
                                <ShieldCheck className="w-3 h-3 opacity-70" /> ALLOW
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 group-hover:text-cyan-400">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </td>
                        </motion.tr>
                        
                        {/* Expanded Details Row */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr 
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                              className="bg-black/30 border-b border-white/5"
                            >
                              <td colSpan={7} className="p-0">
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="bg-white/[0.02] p-4 rounded-lg border border-white/5">
                                    <h4 className="text-[10px] uppercase text-gray-500 tracking-widest mb-3 flex items-center gap-2"><Activity className="w-3 h-3 text-cyan-400"/> AI Engine Trace</h4>
                                    <div className="space-y-2 text-xs">
                                      <div className="flex justify-between"><span className="text-gray-400">ML Confidence:</span><span className="text-white font-bold">{(tx.score?.ml_score * 100 || 0).toFixed(1)}%</span></div>
                                      <div className="flex justify-between"><span className="text-gray-400">IP Risk:</span><span className="text-white font-bold">{(tx.score?.ip_score * 100 || 0).toFixed(1)}%</span></div>
                                      <div className="flex justify-between"><span className="text-gray-400">Behavioral Anomaly:</span><span className="text-white font-bold">{(tx.score?.behavior_score * 100 || 0).toFixed(1)}%</span></div>
                                    </div>
                                  </div>
                                  <div className="bg-white/[0.02] p-4 rounded-lg border border-white/5">
                                    <h4 className="text-[10px] uppercase text-gray-500 tracking-widest mb-3 flex items-center gap-2"><MapPin className="w-3 h-3 text-purple-400"/> Connection Origin</h4>
                                    <div className="space-y-2 text-xs">
                                      <div className="flex justify-between"><span className="text-gray-400">IP Address:</span><span className="text-white font-mono">{tx.ip_address}</span></div>
                                      <div className="flex justify-between"><span className="text-gray-400">Velocity Check:</span><span className="text-green-400">PASS</span></div>
                                      <div className="flex justify-between"><span className="text-gray-400">VPN Node:</span><span className="text-green-400">FALSE</span></div>
                                    </div>
                                  </div>
                                  <div className="bg-white/[0.02] p-4 rounded-lg border border-white/5">
                                    <h4 className="text-[10px] uppercase text-gray-500 tracking-widest mb-3 flex items-center gap-2"><Smartphone className="w-3 h-3 text-yellow-400"/> Device Intelligence</h4>
                                    <div className="space-y-2 text-xs">
                                      <div className="flex justify-between"><span className="text-gray-400">Device Hash:</span><span className="text-white font-mono">{tx.device_id?.substring(0,10)}...</span></div>
                                      <div className="flex justify-between"><span className="text-gray-400">Trust Level:</span><span className={finalScore > 0.8 ? 'text-red-400' : 'text-green-400'}>{finalScore > 0.8 ? 'UNTRUSTED' : 'TRUSTED'}</span></div>
                                      <div className="flex justify-between"><span className="text-gray-400">Session Match:</span><span className="text-green-400">VALID</span></div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CyberCard>
        )}
      </div>
    </div>
  );
};

export default Transactions;
