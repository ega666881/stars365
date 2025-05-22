import axios from 'axios';
import { backendIp } from './request';

const axiosInstance = axios.create({
  baseURL: `${backendIp}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

axiosInstance.interceptors.request.use(config => {
  config.headers['X-Telegram-Init-Data'] = Telegram.WebApp.initData;
  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosInstance;
