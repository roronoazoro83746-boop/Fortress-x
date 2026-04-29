import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublicMetrics } from '../services/api';
import { Shield, Play, Brain, Users, Globe, Zap, Lock } from 'lucide-react';

const Landing: React.FC = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    transactionsAnalyzed: 0,
    threatsBlocked: 0,
    avgRiskScore: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getPublicMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to load public metrics", error);
      }
    };
    fetchMetrics();

    // Connect to WebSocket for live updates
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/api/v1/ws/dashboard";
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "dashboard_update" && data.publicMetrics) {
          setMetrics(data.publicMetrics);
        }
      } catch (e) {
        console.error("Error parsing WS message", e);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#070514] text-white overflow-hidden relative font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600/20 p-2 rounded-xl border border-purple-500/30">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-wider">FORTRESS-X</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">AI-Powered Fraud Detection</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-sm text-gray-300 font-medium">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">How It Works</a>
          <a href="#" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Use Cases</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">About Us</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium">
            Sign In
          </Link>
          <Link to="/dashboard" className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 transition-all rounded-xl text-sm font-medium shadow-[0_0_20px_rgba(147,51,234,0.3)]">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col lg:flex-row items-center relative z-10">
        
        {/* Left Content */}
        <div className="flex-1 lg:pr-12">
          <h2 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
            Intelligent Protection <br />
            Against <span className="text-purple-400">Financial Fraud</span>
          </h2>
          <p className="text-gray-400 text-lg lg:text-xl mb-10 max-w-2xl leading-relaxed">
            FORTRESS-X combines AI, behavioral analytics, and cyber intelligence to detect and prevent fraud in real-time. Secure every transaction. Trust every decision.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/dashboard" className="px-8 py-4 bg-purple-600 hover:bg-purple-500 transition-all rounded-xl text-base font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(147,51,234,0.4)]">
              <Shield className="w-5 h-5" /> Get Started Now
            </Link>
            <button className="px-8 py-4 border border-white/10 hover:bg-white/5 transition-all rounded-xl text-base font-bold flex items-center gap-2">
              <Play className="w-5 h-5" /> Watch Demo
            </button>
          </div>
        </div>

        {/* Right Graphic */}
        <div className="flex-1 mt-20 lg:mt-0 relative flex justify-center items-center">
          <div className="relative w-[500px] h-[500px] flex justify-center items-center">
            {/* Pulsing Rings */}
            <div className="absolute w-[400px] h-[400px] border border-purple-500/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            <div className="absolute w-[300px] h-[300px] border border-purple-400/30 rounded-full"></div>
            <div className="absolute w-[200px] h-[200px] border border-purple-400/50 rounded-full"></div>
            
            {/* Center Shield */}
            <div className="relative z-10 p-12 bg-gradient-to-b from-purple-500/20 to-purple-900/40 rounded-[2.5rem] border border-purple-500/30 backdrop-blur-md shadow-[0_0_80px_rgba(147,51,234,0.4)] flex items-center justify-center">
               <Shield className="w-32 h-32 text-purple-400" strokeWidth={1} />
               <Lock className="w-12 h-12 text-white absolute" />
            </div>

            {/* Floating Badges */}
            <div className="absolute top-[10%] left-[10%] bg-[#110d26] border border-purple-500/30 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-xl animate-[bounce_4s_infinite]">
              <Brain className="w-6 h-6 text-purple-400" />
              <span className="text-xs font-medium text-gray-300">AI Detection</span>
            </div>
            
            <div className="absolute top-[20%] right-[5%] bg-[#110d26] border border-purple-500/30 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-xl animate-[bounce_5s_infinite]">
              <Globe className="w-6 h-6 text-purple-400" />
              <span className="text-xs font-medium text-gray-300">Cyber Intelligence</span>
            </div>

            <div className="absolute bottom-[25%] left-[0%] bg-[#110d26] border border-purple-500/30 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-xl animate-[bounce_6s_infinite]">
              <Users className="w-6 h-6 text-purple-400" />
              <span className="text-xs font-medium text-gray-300">Behavioral Analytics</span>
            </div>

            <div className="absolute bottom-[10%] right-[10%] bg-[#110d26] border border-green-500/30 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-xl animate-[bounce_4.5s_infinite]">
              <Shield className="w-6 h-6 text-green-400" />
              <span className="text-xs font-medium text-gray-300">Real-time Protection</span>
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Stats */}
      <div className="max-w-6xl mx-auto bg-[#110e1f] border border-white/5 rounded-3xl p-8 mb-20 relative z-10 flex flex-wrap justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-purple-600/10 p-4 rounded-full border border-purple-500/20">
             <Users className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-purple-400 mb-1">{metrics.activeUsers}</h3>
            <p className="text-sm text-gray-400 font-medium">Active Users</p>
          </div>
        </div>

        <div className="h-16 w-px bg-white/10 hidden md:block"></div>

        <div className="flex items-center gap-6">
          <div className="bg-green-500/10 p-4 rounded-full border border-green-500/20">
             <Lock className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-green-400 mb-1">{metrics.transactionsAnalyzed.toLocaleString()}</h3>
            <p className="text-sm text-gray-400 font-medium">Transactions Analyzed</p>
          </div>
        </div>

        <div className="h-16 w-px bg-white/10 hidden md:block"></div>

        <div className="flex items-center gap-6">
          <div className="bg-blue-500/10 p-4 rounded-full border border-blue-500/20">
             <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-400 mb-1">{metrics.threatsBlocked.toLocaleString()}</h3>
            <p className="text-sm text-gray-400 font-medium">Threats Blocked</p>
          </div>
        </div>

        <div className="h-16 w-px bg-white/10 hidden lg:block"></div>

        <div className="flex items-center gap-6">
          <div className="bg-orange-500/10 p-4 rounded-full border border-orange-500/20">
             <Zap className="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-orange-400 mb-1">{metrics.avgRiskScore}%</h3>
            <p className="text-sm text-gray-400 font-medium">Avg Risk Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
