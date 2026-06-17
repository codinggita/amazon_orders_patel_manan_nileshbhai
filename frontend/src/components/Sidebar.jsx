import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Drawer from '@mui/material/Drawer';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

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
    <div className="flex-1 flex flex-col min-h-0 bg-premium-darker border-r border-white/5 shadow-2xl">
      <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto custom-scrollbar">
        <div className="flex items-center flex-shrink-0 px-6 mb-6">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-premium-accent to-indigo-700 flex items-center justify-center mr-3 shadow-lg shadow-premium-accent/30">
            <ViewInArIcon className="text-white w-5 h-5" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">NexAdmin</span>
        </div>
        <nav className="mt-4 flex-1 px-4 space-y-2">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/dashboard'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                classNames(
                  isActive 
                    ? 'bg-premium-accent/10 text-premium-accent border border-premium-accent/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent',
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={classNames(
                      isActive ? 'text-premium-accent' : 'text-gray-500 group-hover:text-gray-300',
                      'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200'
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
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            backgroundColor: '#06090F',
            backgroundImage: 'none',
            borderRight: '1px solid rgba(255,255,255,0.05)'
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 transition-all duration-300 ease-in-out">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
