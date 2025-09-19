// import axios from "axios";

// const API_URL = "https://transportbrokerapp-backend.onrender.com/api"; // Adjust to your backend URL

// const JournalService = {
//   // Fetch all journal entries
//   getJournalEntries: () => axios.get(`${API_URL}/journal-entries/`),

//   // Fetch single journal entry by ID
//   getJournalEntry: (id) => axios.get(`${API_URL}/journal-entries/${id}/`),

//   // Create new journal entry
//   createJournalEntry: (data) => axios.post(`${API_URL}/journal-entries/`, data),

//   // Update journal entry by ID
//   updateJournalEntry: (id, data) => axios.put(`${API_URL}/journal-entries/${id}/`, data),

//   // Delete journal entry by ID
//   deleteJournalEntry: (id) => axios.delete(`${API_URL}/journal-entries/${id}/`),

//   // Fetch next voucher number for a given voucher type
//   getNextVoucher: (voucherType) =>
//     axios.get(`${API_URL}/journal-entries/next-voucher/?type=${voucherType}`),
// };

// export default JournalService;


// import axios from "axios";

// const API_URL = "https://transportbrokerapp-backend.onrender.com/api"; // Adjust to your backend URL

// // Create axios instance
// const api = axios.create({
//   baseURL: API_URL,
// });

// // Attach access token on every request
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

//           originalRequest.headers.Authorization = `Bearer ${newAccess}`;
//           return api(originalRequest);
//         }
//       } catch (err) {
//         console.error("Token refresh failed", err);
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");
//         window.location.href = "/login"; // redirect user back to login
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// const JournalService = {
//   // Fetch all journal entries
//   getJournalEntries: () => api.get(`/journal-entries/`),

//   // Fetch single journal entry by ID
//   getJournalEntry: (id) => api.get(`/journal-entries/${id}/`),

//   // Create new journal entry
//   createJournalEntry: (data) => api.post(`/journal-entries/`, data),

//   // Update journal entry by ID
//   updateJournalEntry: (id, data) => api.put(`/journal-entries/${id}/`, data),

//   // Delete journal entry by ID
//   deleteJournalEntry: (id) => api.delete(`/journal-entries/${id}/`),

//   // Fetch next voucher number for a given voucher type
//   getNextVoucher: (voucherType) =>
//     api.get(`/journal-entries/next-voucher/?type=${voucherType}`),
// };

// export default JournalService;

// src/services/JournalService.js
import axiosInstance from "./AxiosInstance"; // centralized instance

const JournalService = {
  getJournalEntries: () => axiosInstance.get("journal-entries/"),
  getJournalEntry: (id) => axiosInstance.get(`journal-entries/${id}/`),
  createJournalEntry: (data) => axiosInstance.post("journal-entries/", data),
  updateJournalEntry: (id, data) => axiosInstance.put(`journal-entries/${id}/`, data),
  deleteJournalEntry: (id) => axiosInstance.delete(`journal-entries/${id}/`),
  getNextVoucher: (voucherType) =>
    axiosInstance.get(`journal-entries/next-voucher/?type=${voucherType}`),
};

export default JournalService;
