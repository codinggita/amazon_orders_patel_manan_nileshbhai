import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isDestructive = false }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', animation: 'fadeIn 0.15s ease-out' }}
      onClick={onClose}
    >
      <div
        className="relative w-full rounded-2xl p-6"
        style={{
          maxWidth: '420px',
          background: '#0F1320',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 60px -12px rgba(0,0,0,0.6)',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: '#475569', background: 'rgba(255,255,255,0.04)' }}
        >
          <FiX size={14} />
        </button>

        <div className="flex flex-col items-center text-center pt-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{
              background: isDestructive ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
              border: `1px solid ${isDestructive ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)'}`,
            }}>
            <FiAlertTriangle size={20} style={{ color: isDestructive ? '#F87171' : '#818CF8' }} />
          </div>

          <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm mb-7" style={{ color: '#64748B' }}>{message}</p>

          <div className="flex w-full gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: isDestructive ? '#DC2626' : '#6366F1',
                boxShadow: isDestructive ? '0 4px 14px rgba(220,38,38,0.25)' : '0 4px 14px rgba(99,102,241,0.25)',
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
