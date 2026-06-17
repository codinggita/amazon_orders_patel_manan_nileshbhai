import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store/store';
import { fetchProfile, logoutLocally } from './features/auth/authSlice';
import AppRoutes from './routes/AppRoutes';

import GlobalLoader from './components/common/GlobalLoader';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchProfile());
    }

    const handleUnauthorized = () => {
      dispatch(logoutLocally());
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [dispatch]);

  return (
    <>
      <GlobalLoader />
      <AppRoutes />
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <AppContent />
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
