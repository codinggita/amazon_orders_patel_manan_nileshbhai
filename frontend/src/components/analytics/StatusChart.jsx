import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const STATUS_COLORS = {
  Delivered: '#10B981',
  Shipped: '#6366F1',
  Processing: '#3B82F6',
  Pending: '#F59E0B',
  Cancelled: '#EF4444',
  Returned: '#A855F7',
};

const StatusChart = ({ data }) => {
  const breakdown = data?.breakdown;
  if (!breakdown) {
    return (
      <div className="card-panel p-5 h-full flex items-center justify-center">
        <p className="card-text-muted text-sm">No status data available.</p>
      </div>
    );
  }

  const chartData = Object.entries(breakdown)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const pct = total ? ((d.value / total) * 100).toFixed(1) : 0;
    return (
      <div className="bg-white dark:bg-[#12121a] border border-slate-200 dark:border-indigo-500/20 p-3 rounded-xl shadow-lg">
        <p className="text-slate-800 dark:text-white text-sm font-semibold capitalize mb-1">{d.name}</p>
        <p className="text-indigo-500 font-bold text-lg">{d.value?.toLocaleString('en-IN')}</p>
        <p className="text-xs text-slate-500">{pct}% of total</p>
      </div>
    );
  };

  return (
    <div className="card-panel p-5 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300">Order Status Breakdown</h3>
        <p className="card-text-muted text-xs mt-1">{total?.toLocaleString('en-IN')} total orders</p>
      </div>
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}
              dataKey="value" stroke="none">
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#64748B'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-3 px-2">
        {chartData.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[d.name] || '#64748B' }} />
            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 capitalize">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusChart;
