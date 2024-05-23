import axios, { InternalAxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import {
  dropTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from './tokens';
import { jwtDecode } from 'jwt-decode';
import 'dotenv';

const REQUEST_TIMEOUT = 200;
const BASE_URL = `${import.meta.env.VITE_SERVER_URL}`;
const TOKEN_EXPIRATION_THRESHOLD = 1;

enum HttpStatusCode {
  OK = 200,
  UNAUTHORIZED = 401,
}

const token = getAccessToken();

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (!token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp) {
      const isTokenExpired = dayjs.unix(decodedToken.exp).diff(dayjs()) < TOKEN_EXPIRATION_THRESHOLD;

      if (!isTokenExpired) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      }
      const refreshToken = getRefreshToken();
      const decodedRefreshToken = jwtDecode(refreshToken);

      if (decodedRefreshToken.exp) {
        const isRefreshTokenExpired =
          dayjs.unix(decodedRefreshToken.exp).diff(dayjs()) < TOKEN_EXPIRATION_THRESHOLD;

        if (!isRefreshTokenExpired) {
          const response = await axios.post(
            `${BASE_URL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            },
          );

          if (response.status === HttpStatusCode.OK) {
            console.log('refresh token success');
            saveTokens(response.data.access_token, response.data.refresh_token);
            config.headers.Authorization = `Bearer ${getAccessToken()}`;
            return config;
          } else if (response.status === HttpStatusCode.UNAUTHORIZED) {
            console.log('refresh token failed');
            dropTokens();
          }
        }
      }
    }

    return config;
  },
);
