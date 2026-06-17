import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Initialize retry count if not present
    if (config && config.retryCount === undefined) {
      config.retryCount = 0;
    }

    // Determine if we should retry (Network error or 5xx status)
    const shouldRetry = !error.response || (error.response.status >= 500 && error.response.status <= 599);
    
    if (config && shouldRetry && config.retryCount < 2) {
      config.retryCount += 1;
      // Exponential backoff: 1s, 2s...
      await new Promise(resolve => setTimeout(resolve, 1000 * config.retryCount));
      return api(config);
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
