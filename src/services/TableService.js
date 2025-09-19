// import axios from "axios";

// const API_URL = "https://transportbrokerapp-backend.onrender.com/api";

// class TableService {
//   static getTables() {
//     return axios.get(`${API_URL}/tables/`);
//   }

//   static startMatch(id, data) {
//     return axios.post(`${API_URL}/tables/${id}/start-match/`, data);
//   }

//   static endMatch(id, data) {
//     return axios.post(`${API_URL}/tables/${id}/end-match/`, data);
//   }

//   static setMaintenance(id, data) {
//     return axios.post(`${API_URL}/tables/${id}/set-maintenance/`, data);
//   }
// }

// export default TableService;


// import axios from "axios";

// const API_URL = "https://transportbrokerapp-backend.onrender.com/api";

// // Helper to get JWT token from localStorage
// const getAuthHeader = () => {
//   const token = localStorage.getItem("access_token"); // Make sure your JWT is stored here
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// class TableService {
//   static getTables() {
//     return axios.get(`${API_URL}/tables/`, {
//       headers: getAuthHeader(),
//     });
//   }

//   static startMatch(id, data) {
//     return axios.post(`${API_URL}/tables/${id}/start-match/`, data, {
//       headers: getAuthHeader(),
//     });
//   }

//   static endMatch(id, data) {
//     return axios.post(`${API_URL}/tables/${id}/end-match/`, data, {
//       headers: getAuthHeader(),
//     });
//   }

//   static setMaintenance(id, data) {
//     return axios.post(`${API_URL}/tables/${id}/set-maintenance/`, data, {
//       headers: getAuthHeader(),
//     });
//   }
// }

// export default TableService;
