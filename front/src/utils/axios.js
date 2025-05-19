import axios from 'axios';
import { backendIp } from './request';

const axiosInstance = axios.create({
  baseURL: `${backendIp}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

// axiosInstance.interceptors.request.use(config => {
//   const token = localStorage.getItem('jwtToken');
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

export default axiosInstance;
