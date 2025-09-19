// import axios from "axios";

// const API_URL = "https://transportbrokerapp-backend.onrender.com/api/receipts/";

// const ReceiptService = {
//   // Get receipts with optional filters
//   // getReceipts: (filters = {}) => axios.get(`${API_URL}${queryString}`),
//   getReceipts: (query = "") => axios.get(`${API_URL}${query}`),


//   // Create new receipt
//   createReceipt: (data) => axios.post(API_URL, data),

//   // Update receipt
//   updateReceipt: (id, data) => axios.put(`${API_URL}${id}/`, data),

//   // Delete receipt
//   deleteReceipt: (id) => axios.delete(`${API_URL}${id}/`),
// };

// export default ReceiptService;


import axiosInstance from "./AxiosInstance"; // 🔑 use the centralized axios setup

const API_URL = "/receipts/"; // relative path, axiosInstance already has baseURL

const ReceiptService = {
  // Get receipts with optional query string (filters, search, etc.)
  getReceipts: (query = "") => axiosInstance.get(`${API_URL}${query}`),

  // Create new receipt
  createReceipt: (data) => axiosInstance.post(API_URL, data),

  // Update receipt
  updateReceipt: (id, data) => axiosInstance.put(`${API_URL}${id}/`, data),

  // Delete receipt
  deleteReceipt: (id) => axiosInstance.delete(`${API_URL}${id}/`),
};

export default ReceiptService;
