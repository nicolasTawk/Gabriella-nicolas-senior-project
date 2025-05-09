// // src/http-common.js
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api/v1',
// });

// // Optional: automatically attach token to every request if present
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;



// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api/v1',
// });

// // Optional: add interceptor to always attach token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;



import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
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

