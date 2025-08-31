// services/ReportService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/reports/";

const ReportService = {
  // 📌 Get Ledger Report
  getLedger: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}ledger/`, {
        params: filters, // e.g. { account_id, start_date, end_date, transaction_type }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching ledger:", error);

      // return a clean error response
      throw (
        error.response?.data || {
          message: "Failed to fetch ledger data. Please try again later.",
        }
      );
    }
  },

  // 📌 Future Example - Trial Balance Report
  getTrialBalance: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}trial-balance/`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching trial balance:", error);
      throw error.response?.data || { message: "Failed to fetch trial balance." };
    }
  },
};

export default ReportService;
