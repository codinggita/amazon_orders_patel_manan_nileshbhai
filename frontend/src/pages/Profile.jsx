import React from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import Avatar from '@mui/material/Avatar';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Helmet>
        <title>My Profile | Amazon Admin</title>
      </Helmet>

      <div className="glassmorphism-dark rounded-2xl overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-premium-accent to-indigo-800 relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="px-8 pb-8 relative">
          {/* Avatar & Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 mb-8 relative z-10">
            <div className="flex items-end">
              <Avatar 
                sx={{ width: 120, height: 120, fontSize: '3rem', border: '4px solid #151A2D' }}
                className="bg-premium-darker text-white shadow-xl shadow-black/50"
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <div className="ml-6 mb-2">
                <h2 className="text-3xl font-bold text-white">{user?.name || 'Administrator'}</h2>
                <p className="text-premium-accent font-medium capitalize mt-1">{user?.role || 'Admin'}</p>
              </div>
            </div>
            
            <button className="mt-4 sm:mt-0 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg transition-colors font-medium">
              Edit Profile
            </button>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <div className="bg-premium-darker/50 border border-white/5 rounded-lg px-4 py-3 text-white">
                  {user?.name || 'Administrator User'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <div className="bg-premium-darker/50 border border-white/5 rounded-lg px-4 py-3 text-white">
                  {user?.email || 'admin@amazon.com'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Account Role</label>
                <div className="bg-premium-darker/50 border border-white/5 rounded-lg px-4 py-3 text-white capitalize">
                  {user?.role || 'Admin'}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Security Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                <div className="flex justify-between items-center bg-premium-darker/50 border border-white/5 rounded-lg px-4 py-3 text-white">
                  <span>••••••••••••</span>
                  <button className="text-premium-accent hover:text-premium-accentHover text-sm font-medium">Change</button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Two-Factor Authentication</label>
                <div className="flex justify-between items-center bg-premium-darker/50 border border-white/5 rounded-lg px-4 py-3 text-white">
                  <span className="text-red-400">Disabled</span>
                  <button className="text-premium-accent hover:text-premium-accentHover text-sm font-medium">Enable</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
