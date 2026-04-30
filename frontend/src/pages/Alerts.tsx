import React, { useEffect, useState } from 'react';
import { getAlerts } from '../services/api';
import { BellRing, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getAlerts(0, 100);
        setAlerts(data);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) {
    return <div className="p-8 text-white min-h-screen bg-[#070514]">Loading alerts feed...</div>;
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-[#070514] text-white font-sans">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-1 h-6 bg-red-500 rounded-full"></span>
          System Alerts
        </h2>
        <div className="bg-[#110e1f] px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2 text-sm text-gray-400">
          <BellRing className="w-4 h-4 text-red-400" />
          {alerts.length} Total Alerts Logged
        </div>
      </header>

      <div className="bg-[#110e1f] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/30 text-gray-400 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Alert ID</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Associated TXN</th>
                <th className="px-6 py-4">Flag Reason</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <BellRing className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    No security alerts found in the system.
                  </td>
                </tr>
              ) : alerts.map((alert, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-white">AL-{alert.id}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(alert.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-xs">{alert.transaction_id}</td>
                  <td className="px-6 py-4 truncate max-w-[200px]" title={alert.reason}>{alert.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      alert.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      alert.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                      alert.severity === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                      'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      alert.status === 'BLOCKED' ? 'text-red-500' : 
                      alert.status === 'OPEN' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/alerts/${alert.id}`} className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors">
                      Investigate <ExternalLink className="w-3 h-3" />
                    </Link>
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

export default Alerts;
