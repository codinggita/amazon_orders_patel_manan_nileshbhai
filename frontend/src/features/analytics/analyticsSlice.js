import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const calcTrend = (arr, key) => {
  if (!arr?.length || arr.length < 2) return null;
  const last = arr[arr.length - 1][key] || 0;
  const prev = arr[arr.length - 2][key] || 0;
  if (!prev) return null;
  return parseFloat((((last - prev) / prev) * 100).toFixed(1));
};

export const fetchDashboardStats = createAsyncThunk(
  'analytics/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const [revTotal, ordersTotal, returnRate, sysPerf, revMonthly, ordersMonthly] = await Promise.all([
        api.get('/stats/revenue/total'),
        api.get('/stats/orders/total'),
        api.get('/analytics/returns/rate'),
        api.get('/stats/system/performance'),
        api.get('/stats/revenue/monthly'),
        api.get('/stats/orders/monthly'),
      ]);

      const revArr = revMonthly.data?.data || [];
      const ordArr = ordersMonthly.data?.data || [];

      return {
        revenue: revTotal.data?.data || {},
        orders: ordersTotal.data?.data || {},
        returnRate: returnRate.data?.data || {},
        system: sysPerf.data?.data || {},
        revenueTrend: calcTrend(revArr, 'revenue'),
        ordersTrend: calcTrend(ordArr, 'count'),
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchRevenueTrends = createAsyncThunk(
  'analytics/fetchRevenueTrends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/analytics/revenue/monthly');
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch revenue trends');
    }
  }
);

export const fetchRecentOrders = createAsyncThunk(
  'analytics/fetchRecentOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/recent', { params: { page: 1, limit: 5, sort: '-date' } });
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent orders');
    }
  }
);

const initialState = {
  dashboardStats: null,
  revenueTrends: [],
  recentOrders: [],
  status: 'idle',
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: { clearAnalyticsError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchRevenueTrends.fulfilled, (state, action) => {
        state.revenueTrends = action.payload;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.recentOrders = action.payload;
      });
  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
