import axios from "axios";

const API_URL = "https://transportbrokerapp-backend.onrender.com/api"; // adjust your backend URL

// Export as default object so we can import as AccountService
const AccountService = {
  // Account Types
  getAccountTypes: () => axios.get(`${API_URL}/account-types/`),
  createAccountType: (data) => axios.post(`${API_URL}/account-types/`, data),
  updateAccountType: (id, data) => axios.put(`${API_URL}/account-types/${id}/`, data),
  deleteAccountType: (id) => axios.delete(`${API_URL}/account-types/${id}/`),

  // Accounts
  getAccounts: () => axios.get(`${API_URL}/accounts/`),
  createAccount: (data) => axios.post(`${API_URL}/accounts/`, data),
  updateAccount: (id, data) => axios.put(`${API_URL}/accounts/${id}/`, data),
  deleteAccount: (id) => axios.delete(`${API_URL}/accounts/${id}/`),
};

export default AccountService;
