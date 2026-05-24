import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { clearAuthTokens, getAccessToken } from '@/utils/authToken';
import { refreshAccessToken } from '@/api/tokenRefresh';

const REFRESH_URL = '/api/v1/auth/refresh';
const LOGIN_URL = '/api/v1/auth/login';
const REGISTER_URL = '/api/v1/auth/register';

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const axiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

const isAuthEndpoint = (url?: string) =>
  !!url && (url.includes(REFRESH_URL) || url.includes(LOGIN_URL) || url.includes(REGISTER_URL));

axiosInstance.interceptors.request.use((config) => {
  if (isAuthEndpoint(config.url)) return config;
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as RetriableConfig | undefined;

    if (!original || original._retry || isAuthEndpoint(original.url) || status !== 401) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const newToken = await refreshAccessToken();
      original.headers = original.headers ?? {};
      (original.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
      return axiosInstance(original);
    } catch (refreshErr) {
      clearAuthTokens();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/signin')) {
        window.location.assign('/signin');
      }
      return Promise.reject(refreshErr);
    }
  },
);

export const apiClient = <T>(config: AxiosRequestConfig): Promise<T> =>
  axiosInstance(config).then((res) => res.data);

export default apiClient;
