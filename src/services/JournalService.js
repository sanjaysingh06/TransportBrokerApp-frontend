import axios from "axios";

const API_URL = "https://transportbrokerapp-backend.onrender.com/api"; // Adjust to your backend URL

const JournalService = {
  // Fetch all journal entries
  getJournalEntries: () => axios.get(`${API_URL}/journal-entries/`),

  // Create new journal entry
  createJournalEntry: (data) => axios.post(`${API_URL}/journal-entries/`, data),

  // Update journal entry by ID
  updateJournalEntry: (id, data) => axios.put(`${API_URL}/journal-entries/${id}/`, data),

  // Delete journal entry by ID
  deleteJournalEntry: (id) => axios.delete(`${API_URL}/journal-entries/${id}/`),
};

export default JournalService;
