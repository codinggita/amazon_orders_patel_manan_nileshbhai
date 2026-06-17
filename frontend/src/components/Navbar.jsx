import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import { logoutUser } from '../features/auth/authSlice';

export default function Navbar({ setSidebarOpen }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await dispatch(logoutUser());
    navigate('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/dashboard/profile');
  };

  // Generate dynamic breadcrumb
  const pathnames = location.pathname.split('/').filter((x) => x);
  const currentPageName = pathnames.length > 1 
    ? pathnames[pathnames.length - 1].charAt(0).toUpperCase() + pathnames[pathnames.length - 1].slice(1)
    : 'Overview';

  return (
    <div className="relative z-10 flex-shrink-0 flex h-20 glassmorphism-dark border-b-0 border-white/5">
      <button
        type="button"
        className="px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-premium-accent md:hidden hover:text-white transition-colors"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      
      <div className="flex-1 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex-1 flex items-center">
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-medium text-premium-textMuted uppercase tracking-wider mb-0.5">Pages / {currentPageName}</span>
            <h1 className="text-xl font-bold text-white capitalize">{currentPageName}</h1>
          </div>
        </div>
        
        <div className="ml-4 flex items-center space-x-3 sm:space-x-4">
          <div className="hidden sm:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Type here..."
              className="bg-premium-darker/80 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-premium-accent/50 focus:border-premium-accent/50 transition-all w-48 lg:w-64"
            />
          </div>

          <IconButton size="small" className="text-gray-400 hover:text-white transition-colors" sx={{ color: '#9CA3AF' }}>
            <NotificationsNoneIcon />
          </IconButton>

          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

          <div className="flex items-center cursor-pointer hover:bg-white/5 py-1 px-2 rounded-lg transition-colors" onClick={handleMenuOpen}>
            <div className="mr-3 hidden md:block text-right">
              <p className="text-sm font-medium text-white">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-premium-textMuted capitalize">{user?.role || 'Admin'}</p>
            </div>
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'transparent',
                border: '2px solid #6366F1',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              className="bg-gradient-to-tr from-premium-accent to-indigo-400"
            >
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </Avatar>
          </div>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 10px 25px rgba(0,0,0,0.5))',
                mt: 1.5,
                bgcolor: '#151A2D',
                color: '#F3F4F6',
                border: '1px solid rgba(255,255,255,0.1)',
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.5,
                  fontSize: '14px',
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366F1'
                  }
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 20,
                  width: 10,
                  height: 10,
                  bgcolor: '#151A2D',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  borderLeft: '1px solid rgba(255,255,255,0.1)',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleProfile}>My Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <div className="h-px bg-white/10 my-1 mx-2"></div>
            <MenuItem onClick={handleLogout} sx={{ color: '#F87171 !important' }}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}
