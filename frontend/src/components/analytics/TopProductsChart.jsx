import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSelector } from 'react-redux';

const TopProductsChart = ({ data }) => {
  const theme = useSelector((state) => state.ui.theme);
  const isDark = theme === 'dark';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-[#151A2D] border border-slate-200 dark:border-white/[0.08] p-3 rounded-xl shadow-lg">
          <p className="text-slate-800 dark:text-white text-sm font-semibold mb-1 truncate max-w-[200px]">
            {data._id}
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            {data.totalSold} Units Sold
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-panel p-5 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="card-header text-lg">Top Selling Products</h3>
        <p className="text-sm card-text-muted mt-1">By volume across all time</p>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                horizontal={false} 
                stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 
              />
              <XAxis 
                type="number" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 12 }}
              />
              <YAxis 
                dataKey="_id" 
                type="category" 
                axisLine={false}
                tickLine={false}
                tick={false} // We'll render custom labels if needed, or hide them and rely on tooltip
                width={10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }} />
              <Bar dataKey="totalSold" radius={[0, 4, 4, 0]} barSize={24}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#6366F1' : isDark ? '#334155' : '#CBD5E1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="card-text-muted text-sm">No product data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProductsChart;
