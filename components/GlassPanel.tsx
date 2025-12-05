import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '' }) => {
  return (
    <div className={`backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl rounded-xl p-6 relative overflow-hidden ${className}`}>
      {/* Decorative glows */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
      {children}
    </div>
  );
};

export default GlassPanel;