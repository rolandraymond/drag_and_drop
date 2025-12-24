import axios from 'axios';
import { navigateTo } from '../utils/navigation';


const BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/email/resend', '/email/verify'];
    const isAuthRoute = authRoutes.some(route => config.url?.includes(route));
    if (token && config.headers && !isAuthRoute) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      navigateTo('/login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;