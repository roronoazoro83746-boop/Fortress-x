import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, perform auth here. For now, navigate to dashboard.
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070514] text-white flex">
      {/* Left Column (Branding & Info) */}
      <div className="hidden lg:flex flex-col flex-1 p-12 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10 mb-20">
          <div className="bg-purple-600/20 p-2 rounded-xl border border-purple-500/30">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-wider">FORTRESS-X</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">AI-Powered Fraud Detection</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-gray-400 mb-12">Sign in to continue to your account and monitor your transactions in real-time.</p>
          
          {/* Decorative Isometric Graphic Placeholders */}
          <div className="relative w-64 h-64 mb-12">
            <div className="absolute inset-0 bg-purple-500/20 rounded-3xl transform rotate-45 scale-75 border border-purple-400/30 shadow-[0_0_50px_rgba(147,51,234,0.2)]"></div>
            <div className="absolute inset-0 bg-blue-500/10 rounded-3xl transform rotate-[60deg] scale-75 border border-blue-400/20"></div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
               <Shield className="w-20 h-20 text-purple-400 opacity-80" strokeWidth={1} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-gray-300">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              </div>
              <span className="font-medium">AI-Powered Detection</span>
            </div>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              </div>
              <span className="font-medium">Real-time Risk Analysis</span>
            </div>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              </div>
              <span className="font-medium">Advanced Threat Intelligence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0a0818] relative">
        <div className="w-full max-w-md bg-[#110e1f] border border-white/5 rounded-[2rem] p-10 shadow-2xl relative z-10">
          <h2 className="text-3xl font-bold mb-8 text-center">Sign In</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <input 
                  type="email" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-500 hover:text-gray-300" /> : <Eye className="w-5 h-5 text-gray-500 hover:text-gray-300" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded bg-black border-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900" />
                <span className="text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 transition-all rounded-xl font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)] mt-2"
            >
              Sign In
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button 
              type="button"
              className="w-full py-3.5 bg-black/50 border border-white/10 hover:bg-white/5 transition-all rounded-xl font-medium flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-400">
            Don't have an account? <a href="#" className="text-purple-400 hover:text-purple-300 font-medium ml-1 transition-colors">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
