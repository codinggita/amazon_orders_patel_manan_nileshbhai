import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch, FiChevronRight } from 'react-icons/fi';

const PAGE_NAMES = {
  '': 'Overview',
  'orders': 'Orders',
  'users': 'Users',
  'profile': 'Profile',
  'settings': 'Settings',
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
      className="flex-shrink-0 flex items-center justify-between h-14 px-4 sm:px-6"
      style={{
        background: 'rgba(8,11,20,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-1.5 rounded-lg transition-colors"
          style={{ color: '#475569' }}
        >
          <FiMenu size={18} />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm">
          <span style={{ color: '#334155' }}>Dashboard</span>
          {segments.length > 0 && (
            <>
              <FiChevronRight size={12} style={{ color: '#1E293B' }} />
              <span className="font-medium" style={{ color: '#94A3B8' }}>{currentPage}</span>
            </>
          )}
        </div>
      </div>

      {/* Right: search + bell + avatar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className={`relative transition-all duration-200 ${showSearch ? 'w-52' : 'w-8'}`}>
          {showSearch ? (
            <div className="relative">
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" size={13} style={{ color: '#475569' }} />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                onBlur={() => setShowSearch(false)}
                className="w-full text-xs py-2 pl-8 pr-3 rounded-lg outline-none text-white placeholder-slate-600"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ color: '#475569' }}
            >
              <FiSearch size={15} />
            </button>
          )}
        </div>

        {/* Bell */}
        <button className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-colors" style={{ color: '#475569' }}>
          <FiBell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#6366F1' }} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Avatar */}
        <button
          onClick={() => navigate('/dashboard/profile')}
          className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg transition-colors hover:bg-white/[0.03]"
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-none">{user?.name?.split(' ')[0] || 'User'}</p>
            <p className="text-[10px] mt-0.5 capitalize" style={{ color: '#475569' }}>{user?.role}</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
