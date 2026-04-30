import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  BellRing, 
  Activity, 
  Users, 
  Globe, 
  FileText, 
  UserCircle, 
  Settings,
  Shield,
  ChevronRight
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/alerts', label: 'Alerts', icon: BellRing },
    { path: '/risk-analysis', label: 'Risk Analysis', icon: Activity },
    { path: '/behavior', label: 'Behavior Analytics', icon: Users },
    { path: '/cyber-intel', label: 'Cyber Intelligence', icon: Globe },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/users', label: 'Users', icon: UserCircle },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-[#0a0818] flex flex-col h-screen sticky top-0 font-sans">
      <div className="p-6 flex items-center gap-3 mb-4">
        <div className="bg-purple-600/20 p-2 rounded-xl border border-purple-500/30">
          <Shield className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="font-bold tracking-wider text-white text-lg">FORTRESS-X</h1>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 p-3 w-full rounded-xl transition-all font-medium text-sm ${
                  isActive 
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/5 mt-auto">
        <button 
          onClick={() => {
            localStorage.removeItem('fortress_token');
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-center gap-3 p-3 hover:bg-red-500/10 rounded-xl cursor-pointer transition-colors group border border-transparent hover:border-red-500/20"
        >
          <span className="text-sm font-medium text-red-400 group-hover:text-red-300 transition-colors">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
