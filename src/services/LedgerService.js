import JournalService from "./JournalService";

const LedgerService = {
  // Fetch all ledger entries via JournalService
  getLedgerEntries: async () => {
    try {
      const entries = await JournalService.getJournalEntries(); // already response.data
      return entries; 
    } catch (error) {
      console.error("Error fetching ledger entries:", error);
      throw error;
    }
  },
};

export default LedgerService;
