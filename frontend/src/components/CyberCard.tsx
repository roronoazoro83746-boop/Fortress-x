import React from 'react';
import { motion } from 'framer-motion';

interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const CyberCard: React.FC<CyberCardProps> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden bg-[#0f172a]/60 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,243,255,0.05)] rounded-2xl p-6 group ${className}`}
    >
      {/* Background gradients and glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
      
      {/* Cyberpunk accent lines */}
      <div className="absolute top-0 left-0 w-8 h-[1px] bg-cyan-400"></div>
      <div className="absolute top-0 left-0 w-[1px] h-8 bg-cyan-400"></div>
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
