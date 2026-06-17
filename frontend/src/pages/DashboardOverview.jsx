import React from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const StatCard = ({ title, value, icon, trend, colorClass }) => (
  <div className="glassmorphism-dark p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 blur-2xl ${colorClass}`}></div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-premium-textMuted text-sm font-medium mb-1">{title}</p>
        <h4 className="text-3xl font-bold text-white">{value}</h4>
      </div>
      <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${colorClass.replace('bg-', 'text-')}`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm relative z-10">
      <span className={trend > 0 ? 'text-green-400' : 'text-red-400'}>
        {trend > 0 ? '+' : ''}{trend}%
      </span>
      <span className="text-gray-500 ml-2">vs last month</span>
    </div>
  </div>
);

const DashboardOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Dashboard | Amazon Admin</title>
      </Helmet>

      {/* Greeting Section */}
      <div className="glassmorphism p-6 rounded-2xl bg-gradient-to-r from-premium-accent/20 to-transparent border-l-4 border-l-premium-accent">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {user?.name || 'Administrator'}! 👋</h2>
        <p className="text-gray-400 text-sm">
          {isAdmin
            ? "Here's what's happening with your store today."
            : "Track your orders and manage your account."}
        </p>
      </div>

      {isAdmin ? (
        <>
          {/* Admin Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value="$45,231"
              icon={<AttachMoneyIcon />}
              trend={12.5}
              colorClass="bg-green-500 text-green-400"
            />
            <StatCard
              title="Active Orders"
              value="156"
              icon={<ShoppingCartIcon />}
              trend={-2.4}
              colorClass="bg-blue-500 text-blue-400"
            />
            <StatCard
              title="Delivered"
              value="1,423"
              icon={<LocalShippingIcon />}
              trend={8.2}
              colorClass="bg-purple-500 text-purple-400"
            />
            <StatCard
              title="Conversion"
              value="3.2%"
              icon={<TrendingUpIcon />}
              trend={1.1}
              colorClass="bg-orange-500 text-orange-400"
            />
          </div>

          {/* Charts/Tables Placeholder Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glassmorphism-dark rounded-2xl p-6 min-h-[400px]">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue Analytics</h3>
              <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                <p className="text-gray-500">Chart Component Placeholder</p>
              </div>
            </div>
            <div className="glassmorphism-dark rounded-2xl p-6 min-h-[400px]">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Sales</h3>
              <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                <p className="text-gray-500">List Component Placeholder</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* User Specific View */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Orders"
              value="12"
              icon={<ShoppingCartIcon />}
              trend={5}
              colorClass="bg-blue-500 text-blue-400"
            />
            <StatCard
              title="Pending Delivery"
              value="2"
              icon={<LocalShippingIcon />}
              trend={0}
              colorClass="bg-orange-500 text-orange-400"
            />
            <StatCard
              title="Total Spent"
              value="$1,240"
              icon={<AttachMoneyIcon />}
              trend={12}
              colorClass="bg-green-500 text-green-400"
            />
          </div>

          <div className="glassmorphism-dark rounded-2xl p-6 min-h-[300px]">
            <h3 className="text-lg font-semibold text-white mb-4">My Recent Orders</h3>
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-xl">
              <p className="text-gray-500">Orders Table Placeholder</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
