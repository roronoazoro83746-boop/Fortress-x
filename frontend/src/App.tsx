import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import FraudDetection from './pages/FraudDetection';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<'dashboard' | 'fraud'>('dashboard');

  return (
    <div className="flex bg-[#0e0e0e] min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden">
        {activePage === 'dashboard' ? <Dashboard /> : <FraudDetection />}
      </main>

      {/* Global Background Glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-cyan-400/5 blur-[120px] -mr-10 -mt-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-64 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] pointer-events-none"></div>
    </div>
  );
};

export default App;
