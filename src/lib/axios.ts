import axios, { AxiosHeaders, type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
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
    // Send/receive the httpOnly refresh-token cookie on login, refresh and logout.
    withCredentials: true,
    headers: {
      ...systemHeader,
      ...headers,
    },
  });

  attachForbiddenInterceptor(instance);
  return instance;
};

// ── Access-token refresh ────────────────────────────────────────────────────
// Access tokens live 15 minutes. On a 401 we swap the refresh cookie for a new
// access token once and replay the request. Concurrent 401s share one refresh
// call, because each refresh rotates the cookie and a second one would fail.

let refreshInFlight: Promise<string> | null = null;

/** Get a new access token from the refresh cookie (one call at a time). */
export const refreshAccessToken = (): Promise<string> => {
  if (!refreshInFlight) {
    const tokenBefore = localStorage.getItem('accessToken');
    refreshInFlight = apiClient()
      .post('/auth/refresh')
      .then((res) => {
        const token = res.data?.result?.newAccessToken as string | undefined;
        if (!token) throw new Error('Refresh returned no token');
        localStorage.setItem('accessToken', token);
        return token;
      })
      .catch((error) => {
        // Another tab may have refreshed (and rotated the cookie) first.
        const tokenNow = localStorage.getItem('accessToken');
        if (tokenNow && tokenNow !== tokenBefore) return tokenNow;
        throw error;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};

/** True when refresh failed because the session is really over (not a blip). */
export const isSessionRejected = (error: unknown) => {
  const status = (error as AxiosError)?.response?.status;
  return status === 401 || status === 403;
};

/**
 * Session is gone for good: drop the token, and leave the signed-in area.
 * Public pages (landing, pricing, blog) stay put; UserProvider just sees no user.
 */
const endSession = () => {
  localStorage.removeItem('accessToken');
  if (typeof window === 'undefined') return;
  const path = window.location.pathname;
  if (path.startsWith('/app') || path.startsWith('/kyc')) {
    window.location.replace('/auth/login');
  }
};

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

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
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as RetriableConfig | undefined;
      if (error.response?.status !== 401 || !config || config._retried) {
        return Promise.reject(error);
      }
      config._retried = true;
      try {
        await refreshAccessToken();
      } catch (refreshError) {
        // Only a rejected refresh ends the session. A 5xx, 429 or network error
        // (e.g. Redis down) keeps the user signed in to retry later.
        if (isSessionRejected(refreshError)) endSession();
        return Promise.reject(error);
      }
      // The request interceptor re-reads the new token from localStorage.
      return axiosInstance(config);
    }
  );
  return axiosInstance;
}
