import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { setGlobalLoading } from '../ui/uiSlice';
import { toast } from 'react-toastify';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params, { dispatch, rejectWithValue }) => {
    dispatch(setGlobalLoading(true));
    try {
      const response = await api.get('/orders/paged', { params });
      dispatch(setGlobalLoading(false));
      return response.data.data;
    } catch (error) {
      dispatch(setGlobalLoading(false));
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', orderData);
      toast.success('Order created successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ orderId, updateData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/orders/${orderId}`, updateData);
      toast.success('Order updated successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await api.delete(`/orders/${orderId}`);
      toast.success('Order deleted successfully');
      return orderId;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete order');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Load initial filters from sessionStorage
const loadFilters = () => {
  const saved = sessionStorage.getItem('orderFilters');
  return saved ? JSON.parse(saved) : { search: '', status: '', page: 1, limit: 10 };
};

const initialState = {
  orders: [],
  pagination: {
    totalDocs: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  },
  filters: loadFilters(),
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      sessionStorage.setItem('orderFilters', JSON.stringify(state.filters));
    },
    resetFilters: (state) => {
      state.filters = { search: '', status: '', page: 1, limit: 10 };
      sessionStorage.setItem('orderFilters', JSON.stringify(state.filters));
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload.docs || [];
        state.pagination = {
          totalDocs: action.payload.totalDocs,
          totalPages: action.payload.totalPages,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      // Update
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(o => o._id !== action.payload);
      });
  },
});

export const { setFilters, resetFilters } = orderSlice.actions;

export default orderSlice.reducer;
