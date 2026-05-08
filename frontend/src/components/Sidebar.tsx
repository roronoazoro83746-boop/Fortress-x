import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, CreditCard, BellRing, Activity, 
  Users, Globe, FileText, UserCircle, Settings,
  ShieldCheck, Terminal, Cpu, Power, Zap
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/live-feed', label: 'Live Feed', icon: Terminal },
    { path: '/sandbox', label: 'AI Sandbox', icon: Cpu },
    { path: '/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/alerts', label: 'Threat Alerts', icon: BellRing },
    { path: '/risk-analysis', label: 'Risk Analysis', icon: Activity },
    { path: '/behavior', label: 'Behavioral ML', icon: Users },
    { path: '/cyber-intel', label: 'Cyber Intel', icon: Globe },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/users', label: 'Users', icon: UserCircle },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-[#05050b]/80 backdrop-blur-xl flex flex-col h-screen sticky top-0 font-sans z-50 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
      {/* Animated Logo Section */}
      <div className="p-6 flex items-center gap-4 mb-2 relative group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="relative flex-shrink-0"
        >
          <div className="absolute inset-0 bg-purple-500 rounded-full blur-[10px] opacity-40"></div>
          <div className="bg-gradient-to-br from-purple-600 to-cyan-600 p-2 rounded-xl border border-white/10 relative z-10">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        </motion.div>
        <div className="relative z-10">
          <h1 className="font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
            FORTRESS-X
          </h1>
          <p className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase">Core OS v3.1</p>
        </div>
      </div>

      {/* Live System Status Indicator */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-3 py-2 rounded-lg backdrop-blur-sm">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">Nodes Online</span>
          <span className="ml-auto text-[10px] font-mono text-cyan-400 font-bold">100%</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 overflow-y-auto custom-scrollbar pb-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `relative flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition-all duration-300 font-medium text-sm group overflow-hidden ${
                  isActive 
                  ? 'bg-gradient-to-r from-purple-900/40 to-transparent border-l-2 border-purple-400 text-white shadow-[inset_0_0_20px_rgba(168,85,247,0.15)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  {isActive && (
                    <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-10" />
                  )}
                  
                  <Icon className={`w-4 h-4 transition-colors duration-300 relative z-10 ${isActive ? 'text-cyan-400' : 'group-hover:text-purple-400'}`} />
                  <span className="relative z-10 tracking-wide text-[13px]">{item.label}</span>
                  
                  {isActive && (
                    <div className="ml-auto relative z-10">
                      <Zap className="w-3 h-3 text-cyan-400 opacity-50" />
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      {/* Logout Footer */}
      <div className="p-4 border-t border-white/5 mt-auto bg-black/20 backdrop-blur-md">
        <button 
          onClick={() => {
            localStorage.removeItem('fortress_token');
            window.location.href = '/login';
          }}
          className="w-full relative flex items-center justify-center gap-2 p-2.5 rounded-xl cursor-pointer group overflow-hidden border border-white/5 hover:border-red-500/30 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 transition-colors duration-300"></div>
          <Power className="w-4 h-4 text-red-500/70 group-hover:text-red-400 relative z-10 transition-colors" />
          <span className="text-xs font-bold text-red-500/70 group-hover:text-red-400 tracking-widest uppercase relative z-10 transition-colors">Disconnect</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
