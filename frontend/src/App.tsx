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
          <Route path="/alerts/:id" element={<AlertDetails />} />
          
          {/* Catch-all redirect for missing routes like /settings */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
