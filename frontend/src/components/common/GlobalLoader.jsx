import React from 'react';
import { useSelector } from 'react-redux';

const GlobalLoader = () => {
  const globalLoading = useSelector((state) => state.ui.globalLoading);
  if (!globalLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] overflow-hidden" style={{ background: 'rgba(99,102,241,0.1)' }}>
      <div className="h-full rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent, #6366F1, #818CF8, #6366F1, transparent)',
          animation: 'loader-slide 1.2s ease-in-out infinite',
          width: '40%',
        }}
      />
      <style>{`
        @keyframes loader-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
};

export default GlobalLoader;
