import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Globe, FileText, Database, Radar, Network, ShieldCheck } from 'lucide-react';
import { CyberCard } from '../components/CyberCard';

const FuturisticPlaceholder = ({ title, icon: Icon, description, subtitle }: any) => (
  <div className="min-h-screen bg-[#05050b] text-white p-4 md:p-8 flex flex-col items-center">
    <header className="w-full max-w-7xl mb-8 flex items-center gap-4 border-b border-cyan-900/30 pb-6 relative">
      <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
      <div className="p-3 bg-cyan-900/20 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
        <Icon className="w-6 h-6 text-cyan-400" />
      </div>
      <div>
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-widest uppercase">
          {title}
        </h2>
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mt-1">
          {subtitle}
        </p>
      </div>
    </header>

    <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {[1, 2, 3].map((i) => (
        <CyberCard key={i} delay={0.1 * i} className="h-32 flex flex-col justify-between border-white/5 bg-[#0a0a14] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start">
            <div className="w-1/2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
            <div className="w-6 h-6 rounded-md bg-gray-800 animate-pulse"></div>
          </div>
          <div className="w-3/4 h-8 bg-gray-800 rounded-md animate-pulse"></div>
        </CyberCard>
      ))}
    </div>

    <CyberCard delay={0.4} className="w-full max-w-7xl h-[500px] border-white/5 bg-[#0a0a14] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent"></div>
      
      <div className="relative flex flex-col items-center text-center z-10">
        <div className="relative w-32 h-32 mb-8">
          <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#374151" strokeWidth="1" strokeDasharray="5 5" />
          </svg>
          <svg className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite_reverse]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#4b5563" strokeWidth="1" strokeDasharray="10 20" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Database className="w-10 h-10 text-gray-600" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-300 tracking-widest uppercase mb-2">{description}</h3>
        <p className="text-xs font-mono text-gray-500 max-w-md">
          This neural module is currently under active development. Advanced ML capabilities and multi-vector threat visualization will be deployed in the upcoming v3.2 patch.
        </p>
        
        <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/5 rounded-lg text-[10px] font-mono text-cyan-500">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          SYSTEM INDEXING
        </div>
      </div>
    </CyberCard>
  </div>
);

export const RiskAnalysisView = () => <FuturisticPlaceholder title="Risk Analysis" subtitle="Predictive Threat Modeling" icon={Activity} description="Multi-Dimensional Risk Matrix" />;
export const BehaviorAnalyticsView = () => <FuturisticPlaceholder title="Behavior Analytics" subtitle="User Pattern Recognition ML" icon={Users} description="Neural Behavioral Profiling" />;
export const CyberIntelView = () => <FuturisticPlaceholder title="Cyber Intelligence" subtitle="Global Threat Actor Tracking" icon={Globe} description="Global Threat Feed Aggregation" />;
export const ReportsView = () => <FuturisticPlaceholder title="System Reports" subtitle="Automated SOC Documentation" icon={FileText} description="Executive Intelligence Briefs" />;
