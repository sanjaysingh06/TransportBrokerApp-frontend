// src/services/AxiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://transportbrokerapp-backend.onrender.com/api/",
});

// Attach token before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: auto-logout on 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // force redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
