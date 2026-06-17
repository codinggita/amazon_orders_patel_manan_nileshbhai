import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data }) => {
  const formatINR = (v) => `₹${(v / 1000).toFixed(0)}k`;

  const TooltipContent = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-indigo-500/20 p-3 rounded-xl shadow-lg">
        <p className="text-slate-500 text-xs font-semibold uppercase mb-1">{label}</p>
        <p className="text-indigo-500 font-bold text-lg">₹{payload[0].value?.toLocaleString('en-IN')}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 px-5 pt-5">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300">Revenue Velocity</h3>
      </div>
      <div className="flex-1 w-full min-h-[250px] -ml-2">
        {data?.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6366F1', fontSize: 10, fontWeight: 700 }} tickFormatter={formatINR} dx={-10} />
              <Tooltip content={<TooltipContent />} cursor={{ stroke: 'rgba(99,102,241,0.2)', strokeWidth: 1, strokeDasharray: '5 5' }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fill="url(#colorRevenue)"
                activeDot={{ r: 5, fill: '#6366F1', stroke: '#050505', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center"><p className="card-text-muted text-sm">No revenue data available.</p></div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
