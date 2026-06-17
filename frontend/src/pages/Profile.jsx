import React from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FiUser, FiMail, FiShield, FiKey, FiSmartphone, FiCalendar } from 'react-icons/fi';

const InfoRow = ({ icon: Icon, label, value, action }) => (
  <div className="flex items-center justify-between py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)' }}>
        <Icon size={14} style={{ color: '#818CF8' }} />
      </div>
      <div>
        <p className="text-xs" style={{ color: '#475569' }}>{label}</p>
        <p className="text-sm font-medium text-white mt-0.5">{value}</p>
      </div>
    </div>
    {action && (
      <button className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
        style={{ color: '#818CF8', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
        {action}
      </button>
    )}
  </div>
);

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-3xl mx-auto space-y-5" style={{ animation: 'fadeIn 0.35s ease-out' }}>
      <Helmet>
        <title>Profile | OrderFlow Dashboard</title>
      </Helmet>

      {/* Header card */}
      <div className="relative overflow-hidden rounded-2xl" style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Banner */}
        <div className="h-28 relative"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)' }}>
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(99,102,241,0.5) 0%, transparent 60%), radial-gradient(circle at 80% 30%, rgba(139,92,246,0.3) 0%, transparent 50%)' }} />
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 relative z-10">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-xl"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', border: '4px solid #0D1117' }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0 sm:pb-1">
              <h2 className="text-xl font-bold text-white truncate">{user?.name || 'User'}</h2>
              <p className="text-sm" style={{ color: '#475569' }}>{user?.email || 'user@example.com'}</p>
            </div>
            <button className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors self-start sm:self-end"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)' }}>
              Edit Profile
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'Role', value: user?.role?.toUpperCase() || 'USER' },
              { label: 'Email Verified', value: user?.isEmailVerified ? 'Yes' : 'No' },
              { label: 'Member Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-sm font-semibold text-white">{s.value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#334155' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="rounded-2xl p-5" style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-sm font-semibold text-white mb-1">Personal Information</h3>
        <p className="text-xs mb-4" style={{ color: '#334155' }}>Your account details</p>

        <InfoRow icon={FiUser} label="Full Name" value={user?.name || 'User'} action="Edit" />
        <InfoRow icon={FiMail} label="Email Address" value={user?.email || 'user@example.com'} action="Change" />
        <InfoRow icon={FiShield} label="Account Role" value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'} />
        <InfoRow icon={FiCalendar} label="Joined" value={new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
      </div>

      {/* Security */}
      <div className="rounded-2xl p-5" style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-sm font-semibold text-white mb-1">Security</h3>
        <p className="text-xs mb-4" style={{ color: '#334155' }}>Manage your account security</p>

        <InfoRow icon={FiKey} label="Password" value="••••••••••" action="Change" />
        <InfoRow icon={FiSmartphone} label="Two-Factor Auth"
          value={<span style={{ color: '#F87171' }}>Disabled</span>}
          action="Enable" />
      </div>
    </div>
  );
};

export default Profile;
