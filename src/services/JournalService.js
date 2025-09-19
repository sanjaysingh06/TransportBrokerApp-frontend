import axios from "axios";

const API_URL = "https://transportbrokerapp-backend.onrender.com/api"; // Adjust to your backend URL

const JournalService = {
  // Fetch all journal entries
  getJournalEntries: () => axios.get(`${API_URL}/journal-entries/`),

  // Fetch single journal entry by ID
  getJournalEntry: (id) => axios.get(`${API_URL}/journal-entries/${id}/`),

  // Create new journal entry
  createJournalEntry: (data) => axios.post(`${API_URL}/journal-entries/`, data),

  // Update journal entry by ID
  updateJournalEntry: (id, data) => axios.put(`${API_URL}/journal-entries/${id}/`, data),

  // Delete journal entry by ID
  deleteJournalEntry: (id) => axios.delete(`${API_URL}/journal-entries/${id}/`),

  // Fetch next voucher number for a given voucher type
  getNextVoucher: (voucherType) =>
    axios.get(`${API_URL}/journal-entries/next-voucher/?type=${voucherType}`),
};

export default JournalService;
