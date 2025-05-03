// import axios from "axios";

// // initializes common route from backend for frontend use
// export default axios.create({
//   // baseURL: "http://localhost:3000/api",
//   baseURL: process.env.REACT_APP_API_URL,
//   headers: {
//     "Content-Type": "application/json" 
//   }
// });



import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;