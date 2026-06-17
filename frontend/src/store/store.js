import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import userReducer from '../features/users/userSlice';
import orderReducer from '../features/orders/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    users: userReducer,
    orders: orderReducer,
  },
});
