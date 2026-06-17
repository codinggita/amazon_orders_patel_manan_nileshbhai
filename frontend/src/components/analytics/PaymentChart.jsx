import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PAYMENT_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#3B82F6', '#A855F7', '#EF4444'];

const PaymentChart = ({ data }) => {
  const TooltipContent = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-indigo-500/20 p-3 rounded-xl shadow-lg">
        <p className="text-slate-800 dark:text-white text-sm font-semibold mb-1">{d.paymentMethod}</p>
        <p className="text-indigo-500 font-bold text-lg">₹{d.totalAmount?.toLocaleString('en-IN')}</p>
        <p className="text-xs text-slate-500">{d.count} orders ({d.percentage?.toFixed(1)}%)</p>
      </div>
    );
  };

  const sorted = data ? [...data].sort((a, b) => b.totalAmount - a.totalAmount) : [];

  return (
    <div className="card-panel p-5 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300">Payment Distribution</h3>
        <p className="card-text-muted text-xs mt-1">Revenue by payment method</p>
      </div>
      <div className="flex-1 w-full min-h-[200px]">
        {sorted.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sorted} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis type="number" axisLine={false} tickLine={false}
                tick={{ fill: '#6366F1', fontSize: 10, fontWeight: 700 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="paymentMethod" axisLine={false} tickLine={false}
                tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} width={80} />
              <Tooltip content={<TooltipContent />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
              <Bar dataKey="totalAmount" radius={[0, 4, 4, 0]} barSize={20}>
                {sorted.map((_, index) => (
                  <Cell key={index} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="card-text-muted text-sm">No payment data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentChart;
