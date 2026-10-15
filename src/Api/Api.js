import axios from "axios";
import { API_URL, TOKEN_KEY } from "../utils/constants";
import { clearAuth } from "../utils/helpers";

const api = axios.create({ baseURL: API_URL });

// Attach the JWT as a Bearer token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token has expired, drop the session and send the user to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthCall = /\/auth\/(login|register|forgot-password|reset-password)/.test(url);
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY) && !isAuthCall) {
      clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;