import React from 'react';

interface SidebarProps {
  activePage: 'dashboard' | 'fraud';
  onNavigate: (page: 'dashboard' | 'fraud') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  return (
    <aside className="w-64 border-r border-white/10 bg-black flex flex-col p-6 h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          <span className="text-black font-bold text-xl">FX</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white font-heading">FORTRESS X</h1>
      </div>
      
      <nav className="flex-1 space-y-3">
        <button 
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all ${
            activePage === 'dashboard' 
            ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-medium">Dashboard</span>
        </button>
        
        <button 
          onClick={() => onNavigate('fraud')}
          className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all ${
            activePage === 'fraud' 
            ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined">security</span>
          <span className="font-medium">Fraud Detection</span>
        </button>
        
        <button className="flex items-center gap-3 p-3 w-full rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
          <span className="material-symbols-outlined">history</span>
          <span>Risk Alerts</span>
        </button>
        
        <button className="flex items-center gap-3 p-3 w-full rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </button>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 text-gray-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-mono uppercase tracking-widest">Sentinel Active</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
