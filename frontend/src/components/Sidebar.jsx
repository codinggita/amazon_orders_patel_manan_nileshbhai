import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import {
  FiGrid,
  FiUser,
  FiShoppingBag,
  FiLayers,
  FiSearch,
  FiBarChart2,
  FiPieChart,
  FiUsers,
  FiStar,
  FiTrendingUp,
  FiTruck,
  FiLogOut,
} from 'react-icons/fi';

const navGroups = [
  {
    title: 'MAIN',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: FiGrid, end: true, role: 'any' },
      { name: 'Profile', href: '/dashboard/profile', icon: FiUser, role: 'any' },
    ]
  },
  {
    title: 'ORDERS',
    items: [
      { name: 'All Orders', href: '/dashboard/orders', icon: FiShoppingBag, role: 'any' },
      { name: 'Bulk Operations', href: '/dashboard/bulk', icon: FiLayers, role: 'admin' },
      { name: 'Search', href: '/dashboard/search', icon: FiSearch, role: 'any' },
    ]
  },
  {
    title: 'ANALYTICS',
    items: [
      { name: 'Analytics', href: '/dashboard/analytics', icon: FiBarChart2, role: 'admin' },
      { name: 'Statistics', href: '/dashboard/stats', icon: FiPieChart, role: 'admin' },
    ]
  },
  {
    title: 'CUSTOMERS',
    items: [
      { name: 'Customers', href: '/dashboard/users', icon: FiUsers, role: 'admin' },
      { name: 'Recommendations', href: '/dashboard/recommendations', icon: FiStar, role: 'admin' },
    ]
  },
  {
    title: 'PRODUCTS',
    items: [
      { name: 'Trending', href: '/dashboard/trending', icon: FiTrendingUp, role: 'any' },
    ]
  },
  {
    title: 'SHIPPING',
    items: [
      { name: 'Shipments', href: '/dashboard/shipments', icon: FiTruck, role: 'any' },
    ]
  }
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = user?.role || 'user';

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#050505] border-r border-slate-200 dark:border-rose-500/10">
      
      {/* User Profile Card (Top) */}
      <div className="p-4 border-b border-slate-200 dark:border-rose-500/10">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-rose-500/10 border border-slate-200 dark:border-rose-500/20 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-300 flex items-center justify-center text-sm font-bold text-slate-800 flex-shrink-0 shadow-inner">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight">{user?.name || 'User'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.8)]"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-rose-500/80">{role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {navGroups.map((group, idx) => {
          const filteredItems = group.items.filter((i) => i.role === 'any' || i.role === role);
          if (filteredItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest px-2 text-slate-500 dark:text-white/40">
                {group.title}
              </p>
              <div className="space-y-1">
                {filteredItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive 
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 shadow-[0_4px_20px_-4px_rgba(225,29,72,0.15)]' 
                          : 'text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon size={16} className={`flex-shrink-0 transition-colors ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                        <span className="flex-1">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-rose-500/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-white hover:bg-rose-600 group"
        >
          <FiLogOut size={16} className="flex-shrink-0 text-slate-400 group-hover:text-white transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-slate-900/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 flex flex-col">
          <NavContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
