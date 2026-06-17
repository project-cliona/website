import axios, { AxiosHeaders, type AxiosInstance } from 'axios';
import { notify } from '@/lib/toast';

function attachForbiddenInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 403) {
        notify.error(error, "You don't have permission for that action.");
      }
      return Promise.reject(error);
    }
  );
}

export const apiClient = (headers?: AxiosHeaders) => {
  const systemHeader = new AxiosHeaders();
  systemHeader.set('ngrok-skip-browser-warning', true);

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: false,
    headers: {
      ...systemHeader,
      ...headers,
    },
  });

  attachForbiddenInterceptor(instance);
  return instance;
};

export const authenticatedApiClient = () => {
  const axiosInstance = apiClient();
  axiosInstance.interceptors.request.use(async (config) => {
    const access_token = localStorage.getItem("accessToken");
    if (!access_token) {
      return Promise.reject(new Error("Unauthorized: No token found"));
    }
    config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  });
  return axiosInstance;
}

