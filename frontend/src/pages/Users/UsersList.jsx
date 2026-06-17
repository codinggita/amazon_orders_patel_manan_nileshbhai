import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FiShield, FiUserX, FiUserCheck } from 'react-icons/fi';
import { fetchUsers, changeUserRole, toggleUserBan } from '../../features/users/userSlice';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const UsersList = () => {
  const dispatch = useDispatch();
  const { users, pagination, status } = useSelector((state) => state.users);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers({ page, limit: 10 }));
  }, [dispatch, page]);

  const handleBanToggle = () => {
    if (selectedUser) {
      dispatch(toggleUserBan({ userId: selectedUser._id, isBanned: selectedUser.isBanned }));
    }
  };

  const handleRoleChange = () => {
    if (selectedUser) {
      dispatch(changeUserRole({ userId: selectedUser._id, role: selectedUser.role === 'admin' ? 'user' : 'admin' }));
    }
  };

  const columns = [
    {
      header: 'User',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: '#fff' }}>
            {row.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{row.name}</p>
            <p className="text-xs" style={{ color: '#475569' }}>{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => {
        const isAdmin = row.role === 'admin';
        return (
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{
              background: isAdmin ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.03)',
              color: isAdmin ? '#A855F7' : '#475569',
              border: `1px solid ${isAdmin ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.06)'}`,
            }}>
            {row.role.toUpperCase()}
          </span>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'isBanned',
      render: (row) => (
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full"
          style={{
            background: row.isBanned ? 'rgba(239,68,68,0.08)' : 'rgba(52,211,153,0.08)',
            color: row.isBanned ? '#F87171' : '#34D399',
            border: `1px solid ${row.isBanned ? 'rgba(239,68,68,0.15)' : 'rgba(52,211,153,0.15)'}`,
          }}>
          {row.isBanned ? 'BANNED' : 'ACTIVE'}
        </span>
      ),
    },
    {
      header: '',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => { setSelectedUser(row); setIsRoleDialogOpen(true); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: '#475569' }}
            title={row.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
          >
            <FiShield size={13} />
          </button>
          <button
            onClick={() => { setSelectedUser(row); setIsBanDialogOpen(true); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:text-red-400"
            style={{ color: '#475569' }}
            title={row.isBanned ? 'Unban' : 'Ban'}
          >
            {row.isBanned ? <FiUserCheck size={13} /> : <FiUserX size={13} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out' }}>
      <Helmet>
        <title>Users | OrderFlow Dashboard</title>
      </Helmet>

      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">Users</h1>
        <p className="text-sm mt-0.5" style={{ color: '#475569' }}>Manage roles and platform access</p>
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={status === 'loading'}
        pagination={{ ...pagination, page }}
        onPageChange={setPage}
        searchPlaceholder="Search users..."
      />

      <ConfirmDialog
        isOpen={isBanDialogOpen}
        onClose={() => setIsBanDialogOpen(false)}
        onConfirm={handleBanToggle}
        title={selectedUser?.isBanned ? 'Unban User' : 'Ban User'}
        message={`${selectedUser?.isBanned ? 'Unban' : 'Ban'} ${selectedUser?.name}? ${selectedUser?.isBanned ? 'They will regain platform access.' : 'They will lose platform access.'}`}
        confirmText={selectedUser?.isBanned ? 'Unban' : 'Ban'}
        isDestructive={!selectedUser?.isBanned}
      />

      <ConfirmDialog
        isOpen={isRoleDialogOpen}
        onClose={() => setIsRoleDialogOpen(false)}
        onConfirm={handleRoleChange}
        title="Change Role"
        message={`Change ${selectedUser?.name}'s role to ${selectedUser?.role === 'admin' ? 'User' : 'Admin'}?`}
        confirmText="Confirm"
      />
    </div>
  );
};

export default UsersList;
