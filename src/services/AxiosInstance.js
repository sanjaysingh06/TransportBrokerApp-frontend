// src/services/AxiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://transportbrokerapp-backend.onrender.com/api/",
});

// Automatically attach JWT from localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // Replace with your JWT key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
