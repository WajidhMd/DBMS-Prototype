import axios from 'axios';

// Configurable API base URL: Reads from Vite environment variable (VITE_API_URL or VITE_API_BASE_URL)
// If not configured (e.g. in local Vite dev), safely defaults to relative '/api' via Vite proxy
const rawBaseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api';
const baseURL = rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const targetDb = localStorage.getItem('targetDb') || 'postgresql';
    config.headers['x-database-type'] = targetDb;

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
