import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Drawer from '@mui/material/Drawer';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon, role: 'any' },
  { name: 'My Orders', href: '/dashboard/orders', icon: ListAltIcon, role: 'user' },
  { name: 'All Orders', href: '/dashboard/orders', icon: ListAltIcon, role: 'admin' },
  { name: 'Users', href: '/dashboard/users', icon: PeopleIcon, role: 'admin' },
  { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon, role: 'any' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || 'user';

  const filteredNavigation = navigation.filter((item) => item.role === 'any' || item.role === role);

  const SidebarContent = () => (
    <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          {/* Logo Placeholder */}
          <span className="text-indigo-600 font-bold text-xl tracking-tight">Amazon Orders</span>
        </div>
        <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/dashboard'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                classNames(
                  isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={classNames(
                      isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6 transition-colors'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 256 },
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
