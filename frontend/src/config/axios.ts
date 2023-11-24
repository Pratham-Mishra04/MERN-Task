import Toaster from '@/utils/toaster';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

const TOKEN_EXPIRATION_ERROR = 'Session Expired, Log In Again';

interface MyAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshError extends Omit<AxiosError, 'response'> {
  response?: AxiosResponse<{ message: string }>;
}

const configuredAxios = axios.create({
  baseURL: BACKEND_URL,
});

let isRefreshing = false; // Flag to track if a refresh request is ongoing
let refreshSubscribers: ((token: string) => void)[] = []; // Array to hold the pending requests while token is being refreshed

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// Function to handle the response when the access token is successfully refreshed
function onTokenRefreshed(newToken: string) {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
}

configuredAxios.interceptors.request.use(
  config => {
    const token = Cookies.get('token');

    if (token && token !== '') {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

configuredAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as MyAxiosRequestConfig;

    // If the error response status is 403 and it's not a refresh request itself
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshResponse = await axios.post(
            `${BACKEND_URL}/refresh`,
            {
              token: Cookies.get('token'),
            },
            { withCredentials: true }
          );

          const newAccessToken = refreshResponse.data.token;
          Cookies.set('token', newAccessToken, {
            expires: Number(process.env.NEXT_PUBLIC_COOKIE_EXPIRATION_TIME),
          });

          onTokenRefreshed(newAccessToken);

          originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
          originalRequest._retry = true;

          // Retry the original request with the new access token
          return configuredAxios(originalRequest);
        } catch (refreshError) {
          // Handle the error when the refresh request itself fails
          const errorResponse = refreshError as RefreshError;

          if (errorResponse.response?.data?.message == TOKEN_EXPIRATION_ERROR) {
            Toaster.error('Session Expired, Log in again');
            refreshSubscribers = [];
            Cookies.remove('token');
            window.location.assign(`${FRONTEND_URL}/login`);
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // If a refresh request is already in progress, wait for the token to be refreshed
        return new Promise(resolve => {
          subscribeTokenRefresh(newToken => {
            originalRequest.headers!.Authorization = `Bearer ${newToken}`;
            originalRequest._retry = true;
            resolve(configuredAxios(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default configuredAxios;
