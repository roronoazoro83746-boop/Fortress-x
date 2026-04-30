import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login, signup } from '../services/api';

const Login: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
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
          <h2 className="text-4xl font-bold mb-4">{isLoginMode ? 'Welcome Back!' : 'Join Fortress X'}</h2>
          <p className="text-gray-400 mb-12">
            {isLoginMode 
              ? 'Sign in to continue to your account and monitor your transactions in real-time.' 
              : 'Create an account to access advanced AI fraud detection tools and secure your transactions.'}
          </p>
          
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
          </div>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0a0818] relative">
        <div className="w-full max-w-md bg-[#110e1f] border border-white/5 rounded-[2rem] p-10 shadow-2xl relative z-10">
          <h2 className="text-3xl font-bold mb-8 text-center">{isLoginMode ? 'Sign In' : 'Sign Up'}</h2>
          
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-3.5 bg-purple-600 hover:bg-purple-500 transition-all rounded-xl font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)] mt-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Please wait...' : (isLoginMode ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-400">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError(null);
              }} 
              className="text-purple-400 hover:text-purple-300 font-medium ml-2 transition-colors"
            >
              {isLoginMode ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
