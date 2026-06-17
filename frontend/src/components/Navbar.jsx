import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch, FiChevronRight } from 'react-icons/fi';
import ThemeToggle from './common/ThemeToggle';

const PAGE_NAMES = {
  '': 'Overview',
  'orders': 'All Orders',
  'users': 'Customers',
  'profile': 'Profile',
  'settings': 'Settings',
  'search': 'Search',
  'analytics': 'Analytics',
  'stats': 'Statistics',
};

const Navbar = ({ setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  const segments = location.pathname.replace('/dashboard', '').split('/').filter(Boolean);
  const currentPage = segments.length > 0 ? PAGE_NAMES[segments[segments.length - 1]] || segments[segments.length - 1] : 'Overview';

  return (
    <header
      className="flex-shrink-0 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-slate-200 dark:border-rose-500/10 relative z-20"
    >
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl transition-colors text-slate-500 hover:bg-slate-100 dark:hover:bg-rose-500/10"
        >
          <FiMenu size={20} />
        </button>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-sm font-semibold tracking-wide">
          <span className="text-slate-500 dark:text-rose-500/60 uppercase">Dashboard</span>
          {segments.length >= 0 && (
            <>
              <FiChevronRight size={14} className="text-slate-300 dark:text-slate-700" />
              <span className="text-slate-800 dark:text-slate-300 capitalize">{currentPage}</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Search, Live Badge, Theme, Bell, Avatar */}
      <div className="flex items-center gap-3">
        {/* Live Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Live</span>
        </div>

        {/* Search */}
        <div className={`relative transition-all duration-300 ${showSearch ? 'w-48 sm:w-64' : 'w-10'}`}>
          {showSearch ? (
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={14} />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                onBlur={() => setShowSearch(false)}
                className="w-full text-sm py-2 pl-9 pr-3 rounded-full outline-none bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-rose-500/20 text-slate-800 dark:text-white placeholder-slate-400 focus:border-rose-500/50 focus:shadow-[0_0_15px_rgba(225,29,72,0.1)] transition-all"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-rose-500/10"
            >
              <FiSearch size={16} />
            </button>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Bell */}
        <button className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-rose-500/10">
          <FiBell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.8)] border-2 border-white dark:border-[#050505]" />
        </button>

        {/* Avatar Mobile Only (Desktop is in sidebar) */}
        <button
          onClick={() => navigate('/dashboard/profile')}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-300 text-sm font-bold text-slate-800 shadow-inner border border-slate-300 dark:border-slate-400 ml-1"
        >
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
