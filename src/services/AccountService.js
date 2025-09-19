// import axios from "axios";

// const API_URL = "https://transportbrokerapp-backend.onrender.com/api"; // adjust your backend URL

// // Export as default object so we can import as AccountService
// const AccountService = {
//   // Account Types
//   getAccountTypes: () => axios.get(`${API_URL}/account-types/`),
//   createAccountType: (data) => axios.post(`${API_URL}/account-types/`, data),
//   updateAccountType: (id, data) => axios.put(`${API_URL}/account-types/${id}/`, data),
//   deleteAccountType: (id) => axios.delete(`${API_URL}/account-types/${id}/`),

//   // Accounts
//   getAccounts: () => axios.get(`${API_URL}/accounts/`),
//   createAccount: (data) => axios.post(`${API_URL}/accounts/`, data),
//   updateAccount: (id, data) => axios.put(`${API_URL}/accounts/${id}/`, data),
//   deleteAccount: (id) => axios.delete(`${API_URL}/accounts/${id}/`),
// };

// export default AccountService;

// import axios from "axios";

// const API_URL = "https://transportbrokerapp-backend.onrender.com/api"; // adjust to your backend URL

// // Create axios instance
// const api = axios.create({
//   baseURL: API_URL,
// });

// // Attach token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle token refresh automatically
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Prevent infinite loop
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         const refresh = localStorage.getItem("refresh");
//         if (refresh) {
//           const res = await axios.post(`${API_URL}/token/refresh/`, {
//             refresh,
//           });
//           const newAccess = res.data.access;
//           localStorage.setItem("access", newAccess);

//           // Retry original request with new token
//           originalRequest.headers.Authorization = `Bearer ${newAccess}`;
//           return api(originalRequest);
//         }
//       } catch (err) {
//         console.error("Token refresh failed", err);
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");
//         window.location.href = "/login"; // redirect to login
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// const AccountService = {
//   // ---------- AUTH ----------
//   login: async (username, password) => {
//     const res = await axios.post(`${API_URL}/token/`, { username, password });
//     localStorage.setItem("access", res.data.access);
//     localStorage.setItem("refresh", res.data.refresh);
//     return res.data;
//   },

//   register: (data) => axios.post(`${API_URL}/register/`, data), // if you have registration endpoint

//   logout: () => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//   },

//   getProfile: () => api.get(`/profile/`), // needs backend endpoint

//   // ---------- ACCOUNT TYPES ----------
//   getAccountTypes: () => api.get(`/account-types/`),
//   createAccountType: (data) => api.post(`/account-types/`, data),
//   updateAccountType: (id, data) => api.put(`/account-types/${id}/`, data),
//   deleteAccountType: (id) => api.delete(`/account-types/${id}/`),

//   // ---------- ACCOUNTS ----------
//   getAccounts: () => api.get(`/accounts/`),
//   createAccount: (data) => api.post(`/accounts/`, data),
//   updateAccount: (id, data) => api.put(`/accounts/${id}/`, data),
//   deleteAccount: (id) => api.delete(`/accounts/${id}/`),
// };

// export default AccountService;

import axiosInstance from "./AxiosInstance";

const AccountService = {
  login: async (username, password) => {
    const res = await axiosInstance.post("auth/token/", { username, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => JSON.parse(localStorage.getItem("user")),

  getAccountTypes: () => axiosInstance.get("account-types/"),
  createAccountType: (data) => axiosInstance.post("account-types/", data),
  updateAccountType: (id, data) => axiosInstance.put(`account-types/${id}/`, data),
  deleteAccountType: (id) => axiosInstance.delete(`account-types/${id}/`),

  getAccounts: () => axiosInstance.get("accounts/"),
  createAccount: (data) => axiosInstance.post("accounts/", data),
  updateAccount: (id, data) => axiosInstance.put(`accounts/${id}/`, data),
  deleteAccount: (id) => axiosInstance.delete(`accounts/${id}/`),
};

export default AccountService;
