import React, { useState } from 'react';
import { User, Key, Bell, Shield, LogOut } from 'lucide-react';
import { getUserRole } from '../services/api';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const role = getUserRole();

  return (
    <div className="p-8 max-w-[1200px] mx-auto min-h-screen bg-[#070514] text-white font-sans">
      <header className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
          Settings
        </h2>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <User className="w-4 h-4" /> Profile
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Shield className="w-4 h-4" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('api')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'api' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Key className="w-4 h-4" /> API Keys
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-[#110e1f] border border-white/5 rounded-2xl p-8">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b border-white/5 pb-4">User Profile</h3>
              
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  U
                </div>
                <div>
                  <h4 className="text-lg font-medium">Administrator</h4>
                  <p className="text-gray-400 mb-2">admin@fortress-x.com</p>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                    {role === 'admin' ? 'Super Admin' : 'Analyst'}
                  </span>
                </div>
              </div>

              <div className="pt-6 space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                  <input type="text" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500" defaultValue="Administrator" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                  <input type="email" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500" defaultValue="admin@fortress-x.com" />
                </div>
                <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b border-white/5 pb-4">API Configuration</h3>
              <p className="text-gray-400">Manage your Fortress X integration keys. Do not share these keys publicly.</p>
              
              <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Production Secret Key</span>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Active</span>
                </div>
                <div className="flex gap-2">
                  <input type="password" value="api_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" readOnly className="flex-1 bg-transparent border border-white/10 rounded-lg px-4 py-2 text-gray-400 font-mono text-sm focus:outline-none" />
                  <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm transition-colors">Reveal</button>
                  <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm transition-colors">Copy</button>
                </div>
              </div>

              <button className="bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-6 py-2 rounded-lg font-medium transition-colors mt-4">
                Generate New Key
              </button>
            </div>
          )}

          {(activeTab === 'security' || activeTab === 'notifications') && (
            <div className="space-y-6 text-center py-12">
              <LogOut className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold">Feature Unavailable</h3>
              <p className="text-gray-400">This configuration panel is currently disabled in your environment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
