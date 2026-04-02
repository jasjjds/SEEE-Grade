import axios from 'axios';

// Cho production: đặt NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
// Cho local: mặc định http://localhost:8000
const API_URL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:8000`;

const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// get data from res
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// List of Endpoints
export const endpoints = {
  model_predict: {
    health_check: '/',
    predict_cpa: '/predict_cpa',
    predict_subject: '/predict_subject'
  },
};