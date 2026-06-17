import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Your Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
            {user?.name}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
            {user?.email}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 capitalize">
            {user?.role}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
