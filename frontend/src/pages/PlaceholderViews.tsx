import React from 'react';
import { Activity, Globe, FileText, Lock } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
  icon: 'risk' | 'cyber' | 'reports' | 'behavior';
}

const PlaceholderView: React.FC<PlaceholderProps> = ({ title, description, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'risk': return <Activity className="w-16 h-16 text-purple-500 mb-6" />;
      case 'cyber': return <Globe className="w-16 h-16 text-blue-500 mb-6" />;
      case 'reports': return <FileText className="w-16 h-16 text-green-500 mb-6" />;
      case 'behavior': return <Lock className="w-16 h-16 text-red-500 mb-6" />;
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#070514] text-white flex flex-col font-sans">
      <header className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
          {title}
        </h2>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center border border-white/5 bg-[#110e1f] rounded-2xl p-12 text-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/10 blur-[100px] pointer-events-none"></div>
        
        {getIcon()}
        
        <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Module Under Development
        </h3>
        
        <p className="text-gray-400 max-w-lg mb-8 text-lg">
          {description}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Estimated Release: Q4 2026
        </div>
      </div>
    </div>
  );
};

export const RiskAnalysisView = () => (
  <PlaceholderView 
    title="Risk Analysis" 
    description="Advanced predictive risk modeling and historical threat vector analysis tools will be available in this module." 
    icon="risk" 
  />
);

export const BehaviorAnalyticsView = () => (
  <PlaceholderView 
    title="Behavior Analytics" 
    description="Deep learning models tracking user interaction patterns to detect non-human or hijacked account behaviors." 
    icon="behavior" 
  />
);

export const CyberIntelView = () => (
  <PlaceholderView 
    title="Cyber Intelligence" 
    description="Global threat maps, known malicious IP databases, and dark web credential leak integrations." 
    icon="cyber" 
  />
);

export const ReportsView = () => (
  <PlaceholderView 
    title="Reports & Compliance" 
    description="Automated compliance report generation (SOC2, GDPR, PCI-DSS) and custom data export tools." 
    icon="reports" 
  />
);
