import axios, { type AxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

export const axiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiClient = <T>(config: AxiosRequestConfig): Promise<T> =>
  axiosInstance(config).then((res) => res.data);

export default apiClient;
