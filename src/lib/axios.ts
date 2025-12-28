import axios, { AxiosHeaders } from 'axios';
import { createClient } from './supabase/client';

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

  return instance;
};

export const authenticatedApiClient = () => {
  // const supabase = createClient();
  const axiosInstance = apiClient();
  axiosInstance.interceptors.request.use(async (config) => {
    // const access_token = localStorage.getItem("accessToken");
    // if (!access_token) {
    //   console.warn("No access token found.");
    //   return Promise.reject(new Error("Unauthorized: No token found"));
    // }
    // config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  });
  return axiosInstance;
}

