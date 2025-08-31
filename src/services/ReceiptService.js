import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/receipts/";

const ReceiptService = {
  // Get receipts with optional filters
  // getReceipts: (filters = {}) => axios.get(`${API_URL}${queryString}`),
  getReceipts: (query = "") => axios.get(`${API_URL}${query}`),


  // Create new receipt
  createReceipt: (data) => axios.post(API_URL, data),

  // Update receipt
  updateReceipt: (id, data) => axios.put(`${API_URL}${id}/`, data),

  // Delete receipt
  deleteReceipt: (id) => axios.delete(`${API_URL}${id}/`),
};

export default ReceiptService;
