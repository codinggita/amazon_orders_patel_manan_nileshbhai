import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Helper: safely call an API endpoint and return fallback on failure
const safeGet = async (url, fallback = null) => {
  try {
    const res = await api.get(url);
    return res.data?.data ?? fallback;
  } catch {
    console.warn(`[Analytics] Failed to fetch ${url}`);
    return fallback;
  }
};

// Single thunk that fetches ALL dashboard data with individual error handling
// so one broken endpoint doesn't block the entire dashboard
export const fetchDashboardStats = createAsyncThunk(
  'analytics/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const [
        revTotal,
        ordersCount,
        returnRate,
        sysPerf,
        avgOrderValue,
        paymentDist,
        recentOrders,
      ] = await Promise.all([
        safeGet('/stats/revenue/total', {}),
        safeGet('/analytics/orders/count', {}),
        safeGet('/analytics/returns/rate', {}),
        safeGet('/stats/system/performance', {}),
        safeGet('/analytics/orders/average-value', {}),
        safeGet('/analytics/payments/distribution', []),
        safeGet('/orders/recent?page=1&limit=5', []),
      ]);

      return {
        revenue: revTotal,
        orders: ordersCount,
        returnRate: returnRate,
        system: sysPerf,
        averageOrderValue: avgOrderValue,
        paymentDistribution: paymentDist,
        recentOrders: Array.isArray(recentOrders) ? recentOrders : [],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

// Separate thunk for order status breakdown (for the pie chart)
export const fetchOrderStatusBreakdown = createAsyncThunk(
  'analytics/fetchOrderStatusBreakdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/analytics/orders/count');
      return response.data?.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order status breakdown');
    }
  }
);

// Separate thunk for payment distribution (for the bar chart)
export const fetchPaymentDistribution = createAsyncThunk(
  'analytics/fetchPaymentDistribution',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/analytics/payments/distribution');
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment distribution');
    }
  }
);

// Fetch return rate breakdown by category (for category chart)
export const fetchReturnsByCategory = createAsyncThunk(
  'analytics/fetchReturnsByCategory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/analytics/returns/rate');
      return response.data?.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch returns by category');
    }
  }
);

const initialState = {
  dashboardStats: null,
  orderStatusBreakdown: null,
  paymentDistribution: [],
  returnsByCategory: null,
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
      .addCase(fetchOrderStatusBreakdown.fulfilled, (state, action) => {
        state.orderStatusBreakdown = action.payload;
      })
      .addCase(fetchPaymentDistribution.fulfilled, (state, action) => {
        state.paymentDistribution = action.payload;
      })
      .addCase(fetchReturnsByCategory.fulfilled, (state, action) => {
        state.returnsByCategory = action.payload;
      });
  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
