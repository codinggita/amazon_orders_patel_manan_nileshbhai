import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiDollarSign, FiShoppingCart, FiRefreshCw, FiActivity, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import { fetchDashboardStats, fetchOrderStatusBreakdown, fetchPaymentDistribution, fetchReturnsByCategory } from '../features/analytics/analyticsSlice';
import StatCard from '../components/analytics/StatCard';
import StatusChart from '../components/analytics/StatusChart';
import PaymentChart from '../components/analytics/PaymentChart';
import { SkeletonCard, SkeletonBox } from '../components/common/SkeletonLoader';

const formatINR = (val) => {
  if (!val) return '₹0';
  const n = parseFloat(val);
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const formatSmallINR = (val) => {
  const n = parseFloat(val?.$numberDecimal || val || 0);
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const statusStyle = (s) => {
  const map = {
    Delivered: { bg: 'rgba(16,185,129,0.08)', color: '#10B981', border: 'rgba(16,185,129,0.2)' },
    Shipped: { bg: 'rgba(99,102,241,0.08)', color: '#6366F1', border: 'rgba(99,102,241,0.2)' },
    Pending: { bg: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: 'rgba(245,158,11,0.2)' },
  };
  return map[s] || map.Pending;
};

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  
  // Destructure from updated slice
  const { dashboardStats, orderStatusBreakdown, paymentDistribution, status } = useSelector((s) => s.analytics);
  
  const isLoading = status === 'loading' || status === 'idle';

  useEffect(() => {
    // We now fetch data for everyone, not just admins!
    dispatch(fetchDashboardStats());
    dispatch(fetchOrderStatusBreakdown());
    dispatch(fetchPaymentDistribution());
    dispatch(fetchReturnsByCategory());
  }, [dispatch]);

  const returnRate = dashboardStats?.returnRate?.overallReturnRate ?? 0;
  const isHealthy = dashboardStats?.system?.databaseStatus === 'connected';
  const avgOrderVal = dashboardStats?.averageOrderValue?.averageOrderValue ?? 0;
  const recentOrders = dashboardStats?.recentOrders || [];

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      <Helmet><title>Analytics Dashboard | OrderPulse</title></Helmet>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-500 mb-1">Operational Dashboard</p>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Real-time metrics for Amazon Seller Central</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
        {isLoading ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />) : (
          <>
            <StatCard title="Total Revenue" value={formatINR(dashboardStats?.revenue?.totalRevenue)} icon={FiDollarSign}
              iconBgColor="rgba(16,185,129,0.15)" iconColor="#10B981" />
            <StatCard title="Total Orders" value={(dashboardStats?.orders?.totalOrders || 0).toLocaleString()} icon={FiShoppingCart}
              iconBgColor="rgba(99,102,241,0.15)" iconColor="#6366F1" />
            <StatCard title="Avg Order Value" value={formatINR(avgOrderVal)} icon={FiTrendingUp}
              iconBgColor="rgba(168,85,247,0.15)" iconColor="#A855F7"
              customLabel={dashboardStats?.averageOrderValue ? `${(dashboardStats?.averageOrderValue?.totalOrdersCount || 0).toLocaleString('en-IN')} orders` : undefined} />
            <StatCard title="Return Rate" value={`${returnRate.toFixed(1)}%`} icon={FiRefreshCw}
              trend={returnRate > 3 ? 1.1 : -1.1} trendLabel="vs last month" iconBgColor="rgba(245,158,11,0.15)" iconColor="#F59E0B" />
            <StatCard title="Returns Count" value={(dashboardStats?.returnRate?.returnedOrders || 0).toLocaleString()} icon={FiBarChart2}
              iconBgColor="rgba(16,185,129,0.15)" iconColor="#10B981" />
            <StatCard title="System Health" value={isHealthy ? '99.9%' : 'Offline'} icon={FiActivity}
              customLabel={isHealthy ? 'Operational' : 'Degraded'} iconBgColor="rgba(59,130,246,0.15)" iconColor="#3B82F6" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:h-[350px]">
        {isLoading ? (
          <>
            <div className="card-panel p-5"><SkeletonBox className="w-1/2 h-6 mb-4" /><SkeletonBox className="w-full h-64" /></div>
            <div className="card-panel p-5"><SkeletonBox className="w-1/2 h-6 mb-4" /><SkeletonBox className="w-full h-64" /></div>
          </>
        ) : (
          <>
            <StatusChart data={orderStatusBreakdown} />
            <PaymentChart data={paymentDistribution} />
          </>
        )}
      </div>

      <div className="card-panel flex flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-indigo-500/10">
          <h3 className="card-header text-sm">Action Required</h3>
        </div>
        <div className="p-5 border-b border-slate-200 dark:border-indigo-500/10 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300">Recent Orders</h3>
          <button onClick={() => navigate('/dashboard/orders')} className="text-xs font-semibold text-indigo-500 hover:text-indigo-400">View All</button>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[400px]">
          {isLoading ? <div className="p-5 space-y-4">{[1, 2, 3].map(i => <SkeletonBox key={i} className="w-full h-12" />)}</div>
            : (
            <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {(recentOrders.length ? recentOrders : []).map((order) => {
                const st = statusStyle(order.OrderStatus);
                return (
                  <div key={order._id || order.OrderID} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => navigate('/dashboard/orders')}>
                    <div>
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-1">{order.OrderID}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{formatSmallINR(order.TotalAmount)}</p>
                    </div>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border"
                      style={{ background: st.bg, color: st.color, borderColor: st.border }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor', boxShadow: '0 0 8px currentColor' }} />
                      {order.OrderStatus}
                    </span>
                  </div>
                );
              })}
              {!recentOrders.length && <p className="p-5 text-sm card-text-muted text-center">No recent orders</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
