import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getAlertDetails } from '../services/api';

const AlertDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [alert, setAlert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        if (id) {
          const data = await getAlertDetails(id);
          setAlert(data);
        }
      } catch (error) {
        console.error("Failed to load alert details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlert();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-white">Loading alert details...</div>;
  }

  if (!alert) {
    return (
      <div className="p-8 text-white">
        <p>Alert not found.</p>
        <Link to="/dashboard" className="text-purple-400 mt-4 inline-block">Return to Dashboard</Link>
      </div>
    );
  }

  const { transaction, score, severity, reason } = alert;

  // Derive some values from severity
  const isCritical = severity === 'CRITICAL';
  const isHigh = severity === 'HIGH';
  const colorClass = isCritical ? 'text-red-500' : isHigh ? 'text-orange-500' : 'text-yellow-500';

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#070514] text-white font-sans">
      
      {/* Top Header */}
      <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 bg-[#110e1f] border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <h2 className="text-2xl font-bold">Alert Details: AL-{alert.id}</h2>
        </div>
        
        <div className={`px-4 py-2 rounded-full text-sm font-bold tracking-wider ${isCritical ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-orange-500/10 border border-orange-500/20 text-orange-500'}`}>
          Risk Level: {severity}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Transaction Information */}
        <div className="bg-[#110e1f] border border-white/5 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg mb-6 border-b border-white/5 pb-4">Transaction Information</h3>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2">
              <span className="text-gray-400">Transaction ID</span>
              <span className="font-medium text-white">{alert.transaction_id}</span>
            </div>
            {transaction && (
              <>
                <div className="grid grid-cols-2">
                  <span className="text-gray-400">User ID</span>
                  <span className="font-medium text-white">{transaction.user_id}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-400">Amount</span>
                  <span className="font-medium text-white">{transaction.currency} {transaction.amount.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-400">IP Address</span>
                  <span className="font-medium text-white">{transaction.ip_address || 'Unknown'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-400">Time</span>
                  <span className="font-medium text-white">{new Date(transaction.timestamp).toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Risk Score */}
        <div className="bg-[#110e1f] border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center justify-center relative overflow-hidden">
          <div className={`absolute top-0 w-full h-1/2 blur-2xl ${isCritical ? 'bg-red-500/5' : 'bg-orange-500/5'}`}></div>
          
          <h3 className="font-semibold text-lg mb-6 w-full text-left">Risk Score</h3>
          
          {score ? (
            <div className="relative w-48 h-24 overflow-hidden mb-6">
              <div className={`absolute top-0 left-0 w-full h-[192px] rounded-full border-[16px] border-white/5 transform -rotate-45 ${isCritical ? 'border-t-red-500 border-r-red-500' : 'border-t-orange-500 border-r-orange-500'}`}></div>
              <div className="absolute bottom-0 w-full text-center flex flex-col items-center justify-end h-full pb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{Math.round(score.final_score * 100)}</span>
                  <span className="text-sm text-gray-500">/100</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 py-8">Score not calculated</div>
          )}
          
          <h4 className={`${colorClass} font-bold text-lg mb-2`}>{severity} Risk</h4>
          <p className="text-sm text-gray-400 max-w-[250px]">
            {alert.status === 'BLOCKED' ? 'This transaction is highly suspicious and has been automatically blocked.' : 'This transaction was flagged for review.'}
          </p>
        </div>

        {/* Prediction */}
        <div className="bg-[#110e1f] border border-white/5 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg mb-6 border-b border-white/5 pb-4">Prediction Components</h3>
          
          {score ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">Final Decision</span>
                <span className={`${colorClass} font-bold`}>{score.decision}</span>
              </div>
              
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-400">ML Model Score</span>
                    <span className="text-white font-medium">{score.ml_score.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, score.ml_score * 100)}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-400">Behavior Score</span>
                    <span className="text-white font-medium">{score.behavior_score.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, score.behavior_score * 100)}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-400">IP Rep Score</span>
                    <span className="text-white font-medium">{score.ip_score.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${Math.min(100, score.ip_score * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400">Prediction trace not available.</div>
          )}
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Risk Factors */}
        <div className="bg-[#110e1f] border border-white/5 p-6 rounded-2xl">
          <h3 className="font-semibold text-lg mb-6">Identified Risk Factors</h3>
          <ul className="space-y-4">
            {score && score.reasons && score.reasons.length > 0 ? (
              score.reasons.map((factor: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm text-gray-300">
                  <div className="mt-1">
                    <ShieldAlert className={`w-4 h-4 ${colorClass}`} />
                  </div>
                  {factor}
                </li>
              ))
            ) : (
              <li className="flex gap-3 text-sm text-gray-300">
                <div className="mt-1">
                  <ShieldAlert className={`w-4 h-4 ${colorClass}`} />
                </div>
                {reason || "General threshold breach."}
              </li>
            )}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-[#110e1f] border border-white/5 p-6 rounded-2xl flex flex-col">
          <h3 className="font-semibold text-lg mb-6">Actions</h3>
          <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-xl flex gap-4 mb-6 flex-1">
            <div className="bg-blue-500/20 p-2 rounded-lg h-fit">
              <ShieldAlert className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-300 leading-relaxed">
                This transaction has been {alert.status === 'BLOCKED' ? 'blocked' : 'flagged'}. You can override this decision or investigate the user's history further.
              </p>
            </div>
          </div>
          <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 transition-colors rounded-xl font-bold shadow-[0_0_15px_rgba(147,51,234,0.3)]">
            Investigate User
          </button>
        </div>
      </div>

    </div>
  );
};

export default AlertDetails;
