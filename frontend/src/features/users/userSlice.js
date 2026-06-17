import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { setGlobalLoading } from '../ui/uiSlice';
import { toast } from 'react-toastify';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params, { dispatch, rejectWithValue }) => {
    dispatch(setGlobalLoading(true));
    try {
      // params can be { page: 1, limit: 10 }
      const response = await api.get('/admin/users', { params });
      dispatch(setGlobalLoading(false));
      return response.data;
    } catch (error) {
      dispatch(setGlobalLoading(false));
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const changeUserRole = createAsyncThunk(
  'users/changeRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/role`, { role });
      toast.success('User role updated');
      return { userId, user: response.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const toggleUserBan = createAsyncThunk(
  'users/toggleBan',
  async ({ userId, isBanned }, { rejectWithValue }) => {
    try {
      const endpoint = isBanned ? `/admin/users/${userId}/unban` : `/admin/users/${userId}/ban`;
      const response = await api.patch(endpoint);
      toast.success(isBanned ? 'User unbanned' : 'User banned');
      return { userId, user: response.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update ban status');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  users: [],
  pagination: {
    totalDocs: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  },
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const responseData = action.payload.data || [];
        const responsePagination = action.payload.pagination || {};

        state.users = responseData;
        state.pagination = {
          totalDocs: responsePagination.totalRecords || 0,
          totalPages: responsePagination.totalPages || 0,
          page: responsePagination.currentPage || 1,
          limit: responsePagination.limit || 10,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Change Role
      .addCase(changeUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload.userId);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })
      // Toggle Ban
      .addCase(toggleUserBan.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload.userId);
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      });
  },
});

export default userSlice.reducer;
