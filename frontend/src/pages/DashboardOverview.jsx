import React from 'react';
import { useSelector } from 'react-redux';

const DashboardOverview = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome back, {user?.name}!</h2>
      <p className="text-gray-600 mb-6">
        This is your dashboard overview. Your current role is: <span className="font-semibold text-indigo-600">{user?.role}</span>
      </p>
      
      {user?.role === 'admin' ? (
        <div className="p-4 bg-indigo-50 rounded-md border border-indigo-100">
          <h3 className="font-medium text-indigo-800">Admin Controls Active</h3>
          <p className="text-sm text-indigo-600 mt-1">You have access to user management, system analytics, and full order controls.</p>
        </div>
      ) : (
        <div className="p-4 bg-green-50 rounded-md border border-green-100">
          <h3 className="font-medium text-green-800">Customer View</h3>
          <p className="text-sm text-green-600 mt-1">You can view your past orders, track current shipments, and update your profile.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
