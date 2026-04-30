import React, { useEffect, useState } from 'react';
import { getTransactions } from '../services/api';
import { CreditCard, ArrowRightLeft, Search } from 'lucide-react';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTxns = async () => {
      try {
        const data = await getTransactions(0, 100);
        setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTxns();
  }, []);

  if (loading) {
    return <div className="p-8 text-white min-h-screen bg-[#070514]">Loading global transaction feed...</div>;
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#070514] text-white font-sans">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
          Global Transactions
        </h2>
        
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search TXN ID or User IP..." 
            className="w-full bg-[#110e1f] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </header>

      <div className="bg-[#110e1f] border border-white/5 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
            <ArrowRightLeft className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-semibold text-lg">Live Authorization Stream</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/30 text-gray-400 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">ML Score</th>
                <th className="px-6 py-4">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    No transactions recorded in the database.
                  </td>
                </tr>
              ) : transactions.map((txn, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-mono font-medium text-white">{txn.id}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(txn.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-white">${txn.amount.toFixed(2)} {txn.currency}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{txn.user_id}</div>
                    <div className="text-xs text-gray-500 font-mono">{txn.ip_address}</div>
                  </td>
                  <td className="px-6 py-4">
                    {txn.score ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${txn.score.final_score > 0.7 ? 'bg-red-500' : txn.score.final_score > 0.4 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(100, Math.max(0, txn.score.final_score * 100))}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-xs">{txn.score.final_score.toFixed(3)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {txn.score ? (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        txn.score.decision === 'BLOCK' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        txn.score.decision === 'REVIEW' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                        'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}>
                        {txn.score.decision}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
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

export default Transactions;
