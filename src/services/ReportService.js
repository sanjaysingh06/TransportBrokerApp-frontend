// // services/ReportService.js
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL || "https://transportbrokerapp-backend.onrender.com/api/reports/";

// const ReportService = {
//   // 📌 Get Ledger Report
//   getLedger: async (filters = {}) => {
//     try {
//       const response = await axios.get(`${API_URL}ledger/`, {
//         params: filters, // e.g. { account_id, start_date, end_date, transaction_type }
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching ledger:", error);

//       // return a clean error response
//       throw (
//         error.response?.data || {
//           message: "Failed to fetch ledger data. Please try again later.",
//         }
//       );
//     }
//   },

//   // 📌 Future Example - Trial Balance Report
//   getTrialBalance: async (filters = {}) => {
//     try {
//       const response = await axios.get(`${API_URL}trial-balance/`, {
//         params: filters,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching trial balance:", error);
//       throw error.response?.data || { message: "Failed to fetch trial balance." };
//     }
//   },
// };

// export default ReportService;

// services/ReportService.js
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL || "https://transportbrokerapp-backend.onrender.com/api/reports/";

// // Helper to get JWT from localStorage
// const getAuthHeader = () => {
//   const token = localStorage.getItem("access_token"); // Make sure this is how you store JWT
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// const ReportService = {
//   // 📌 Get Ledger Report
//   getLedger: async (filters = {}) => {
//     try {
//       const response = await axios.get(`${API_URL}ledger/`, {
//         params: filters,
//         headers: getAuthHeader(),
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching ledger:", error);
//       throw (
//         error.response?.data || {
//           message: "Failed to fetch ledger data. Please try again later.",
//         }
//       );
//     }
//   },

//   // 📌 Trial Balance Report
//   getTrialBalance: async (filters = {}) => {
//     try {
//       const response = await axios.get(`${API_URL}trial-balance/`, {
//         params: filters,
//         headers: getAuthHeader(),
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching trial balance:", error);
//       throw error.response?.data || { message: "Failed to fetch trial balance." };
//     }
//   },
// };

// export default ReportService;

// src/services/ReportService.js
import axiosInstance from "./AxiosInstance"; // centralized instance

const ReportService = {
  // 📌 Get Ledger Report
  getLedger: async (filters = {}) => {
    try {
      const response = await axiosInstance.get("reports/ledger/", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching ledger:", error);
      throw (
        error.response?.data || {
          message: "Failed to fetch ledger data. Please try again later.",
        }
      );
    }
  },

  // 📌 Trial Balance Report
  getTrialBalance: async (filters = {}) => {
    try {
      const response = await axiosInstance.get("reports/trial-balance/", {
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
