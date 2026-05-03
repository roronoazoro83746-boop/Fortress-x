import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AlertDetails from './pages/AlertDetails';
import Landing from './pages/Landing';
import Login from './pages/Login';

// Protected Route Guard
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('fortress_token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Layout component for pages that need the sidebar (Dashboard, Alerts)
const MainLayout = () => {
  return (
    <div className="flex bg-[#070514] min-h-screen font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden relative">
        <Outlet />
      </main>

      {/* Global Background Glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] -mr-10 -mt-10 pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-0 left-64 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] pointer-events-none z-[-1]"></div>
    </div>
  );
};

import Transactions from './pages/Transactions';
import Alerts from './pages/Alerts';
import Users from './pages/Users';
import Settings from './pages/Settings';
import { RiskAnalysisView, BehaviorAnalyticsView, CyberIntelView, ReportsView } from './pages/PlaceholderViews';
import LiveFeed from './pages/LiveFeed';
import Sandbox from './pages/Sandbox';
import { getUserRole } from './services/api';

// Admin Route Guard
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const role = getUserRole();
  const location = useLocation();

  if (role !== 'admin') {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes without Sidebar */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes with Sidebar */}
        <Route element={<AuthGuard><MainLayout /></AuthGuard>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/alerts/:id" element={<AlertDetails />} />
          <Route path="/live-feed" element={<LiveFeed />} />
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="/risk-analysis" element={<RiskAnalysisView />} />
          <Route path="/behavior" element={<BehaviorAnalyticsView />} />
          <Route path="/cyber-intel" element={<CyberIntelView />} />
          <Route path="/reports" element={<ReportsView />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Admin Only Route */}
          <Route path="/users" element={<AdminGuard><Users /></AdminGuard>} />
          
          {/* Catch-all redirect for missing routes like /settings */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
