import JournalService from "./JournalService";

// We reuse JournalService to fetch all journal entries
const LedgerService = {
  getLedgerEntries: async () => {
    try {
      const res = await JournalService.getJournalEntries();
      return res.data;
    } catch (error) {
      console.error("Error fetching ledger entries:", error);
      throw error;
    }
  },
};

export default LedgerService;
