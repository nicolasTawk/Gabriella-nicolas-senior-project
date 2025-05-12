import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Set token in `token` header (NOT `Authorization`)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['token'] = token; // ✅ matches backend expectation
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

