import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import {
  FiGrid,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiChevronRight,
  FiPackage,
} from 'react-icons/fi';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: FiGrid, end: true, role: 'any' },
  { name: 'All Orders', href: '/dashboard/orders', icon: FiShoppingBag, role: 'any' },
  { name: 'Users', href: '/dashboard/users', icon: FiUsers, role: 'admin' },
  { name: 'Settings', href: '/dashboard/settings', icon: FiSettings, role: 'any' },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = user?.role || 'user';

  const filtered = navItems.filter((i) => i.role === 'any' || i.role === role);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full" style={{ background: '#0B0F1A', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
          <FiPackage className="text-white" size={16} />
        </div>
        <div>
          <p className="text-white font-bold text-sm tracking-tight">OrderFlow</p>
          <p className="text-xs" style={{ color: '#334155' }}>Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-3" style={{ color: '#334155' }}>
          Menu
        </p>
        {filtered.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive ? 'text-white' : 'hover:text-slate-200 text-slate-500'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'rgba(99,102,241,0.12)',
              color: '#818CF8'
            } : {}}
          >
            {({ isActive }) => (
              <>
                <item.icon size={16} className={`flex-shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                <span className="flex-1">{item.name}</span>
                {isActive && <FiChevronRight size={12} style={{ color: '#6366F1' }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg mb-2"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs capitalize" style={{ color: '#475569' }}>{user?.role || 'user'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-slate-500 hover:text-red-400 group"
          style={{ ':hover': { background: 'rgba(239,68,68,0.06)' } }}
        >
          <FiLogOut size={15} className="flex-shrink-0 group-hover:text-red-400 transition-colors" />
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
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
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
        <div className="w-56 flex flex-col">
          <NavContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
