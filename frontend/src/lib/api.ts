import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token if present
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('matrimony_logged_user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user?.id) {
        config.headers.Authorization = `Bearer ${user.id}`;
      }
    } catch {
      // ignore parse errors
    }
  }
  return config;
});

// Response interceptor — unwrap data or surface errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'Unknown API error';
    return Promise.reject(new Error(message));
  }
);

export default api;
