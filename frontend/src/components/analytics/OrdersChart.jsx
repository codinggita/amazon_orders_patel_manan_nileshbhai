import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OrdersChart = ({ data }) => {
  const TooltipContent = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-indigo-500/20 p-3 rounded-xl shadow-lg">
        <p className="text-slate-500 text-xs font-semibold uppercase mb-1">{label}</p>
        <p className="text-indigo-500 font-bold text-lg">{payload[0].value?.toLocaleString('en-IN')} orders</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 px-5 pt-5">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300">Monthly Orders</h3>
      </div>
      <div className="flex-1 w-full min-h-[250px] -ml-2">
        {data?.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6366F1', fontSize: 10, fontWeight: 700 }} dx={-10} allowDecimals={false} />
              <Tooltip content={<TooltipContent />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
              <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="card-text-muted text-sm">No orders data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersChart;
