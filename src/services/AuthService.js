// src/services/AuthService.js
import axios from "axios";

const API_URL = (process.env.REACT_APP_API_URL || "https://transportbrokerapp-backend.onrender.com/api/") + "auth/token/";

class AuthService {
  async login(username, password) {
    const response = await axios.post(API_URL, { username, password });
    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  async refreshToken() {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      const refreshUrl = (process.env.REACT_APP_API_URL || "https://transportbrokerapp-backend.onrender.com/api/") + "auth/token/refresh/";
      const response = await axios.post(refreshUrl, { refresh });
      localStorage.setItem("access_token", response.data.access);
      return response.data.access;
    }
    return null;
  }
}

export default new AuthService();
