import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = { sm: '480px', md: '640px', lg: '800px', xl: '1024px' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', animation: 'fadeIn 0.15s ease-out' }}
      onClick={onClose}
    >
      <div
        className="relative w-full rounded-2xl flex flex-col overflow-hidden"
        style={{
          maxWidth: sizes[size],
          maxHeight: '85vh',
          background: '#0F1320',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 60px -12px rgba(0,0,0,0.6)',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: '#475569', background: 'rgba(255,255,255,0.04)' }}
          >
            <FiX size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
