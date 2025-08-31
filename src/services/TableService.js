import axios from "axios";

const API_URL = "https://transportbrokerapp-backend.onrender.com/api";

class TableService {
  static getTables() {
    return axios.get(`${API_URL}/tables/`);
  }

  static startMatch(id, data) {
    return axios.post(`${API_URL}/tables/${id}/start-match/`, data);
  }

  static endMatch(id, data) {
    return axios.post(`${API_URL}/tables/${id}/end-match/`, data);
  }

  static setMaintenance(id, data) {
    return axios.post(`${API_URL}/tables/${id}/set-maintenance/`, data);
  }
}

export default TableService;
