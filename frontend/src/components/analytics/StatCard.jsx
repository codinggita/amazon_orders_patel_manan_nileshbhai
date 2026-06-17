import React from 'react';
import { FiArrowUpRight, FiArrowDownRight, FiMinus } from 'react-icons/fi';

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, iconBgColor, iconColor, customLabel }) => {
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <div className="card-panel p-5 border border-slate-200 dark:border-indigo-500/10 dark:bg-[#0a0a0a]">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-indigo-400/80">{title}</h3>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBgColor, color: iconColor }}>
          {Icon && <Icon size={18} />}
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
      <div className="mt-2">
        {customLabel ? (
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500">{customLabel}</span>
          </div>
        ) : trend != null ? (
          <div className={`flex items-center text-xs font-semibold mt-1 ${isPositive ? 'text-emerald-600 dark:text-emerald-500' : isNegative ? 'text-rose-500' : 'text-slate-500'}`}>
            <span className="flex items-center gap-0.5">
              {isPositive ? <FiArrowUpRight size={14} /> : isNegative ? <FiArrowDownRight size={14} /> : <FiMinus size={14} />}
              {trend > 0 && '+'}{trend}%
            </span>
            <span className="text-slate-500 dark:text-white/40 ml-1.5 font-medium">{trendLabel}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StatCard;
