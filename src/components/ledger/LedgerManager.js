import React, { useEffect, useState } from "react";
import AccountService from "../../services/AccountService";
import LedgerService from "../../services/LedgerService";

const LedgerManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [journalEntries, setJournalEntries] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [search, setSearch] = useState(""); // 🔍 new search state

  // Fetch accounts and journal entries
  useEffect(() => {
    fetchAccounts();
    fetchJournalEntries();
  }, []);

  const fetchAccounts = async () => {
    const res = await AccountService.getAccounts();
    setAccounts(res.data);
  };

  const fetchJournalEntries = async () => {
    const entries = await LedgerService.getLedgerEntries();
    setJournalEntries(entries);
  };

  const computeLedger = () => {
    if (!selectedAccount) return;

    let balance = 0;
    const accountId = parseInt(selectedAccount);
    const filtered = [];

    // Filter journal entries by date range if provided
    const entries = journalEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;
      if (startDate && entryDate < startDate) return false;
      if (endDate && entryDate > endDate) return false;
      return true;
    });

    // Compute ledger lines
    entries.forEach((entry) => {
      entry.lines.forEach((line) => {
        if (line.account === accountId) {
          const debit = line.debit || 0;
          const credit = line.credit || 0;
          balance += debit - credit;
          filtered.push({
            date: entry.date,
            voucher_no: entry.voucher_no,
            description: entry.narration || entry.description,
            debit,
            credit,
            balance,
          });
        }
      });
    });

    // Sort by date
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 🔍 Apply search filtering
    const searched = filtered.filter((line) => {
      const searchTerm = search.toLowerCase();
      return (
        line.date.toLowerCase().includes(searchTerm) ||
        (line.voucher_no && line.voucher_no.toLowerCase().includes(searchTerm)) ||
        (line.description && line.description.toLowerCase().includes(searchTerm)) ||
        line.debit.toString().includes(searchTerm) ||
        line.credit.toString().includes(searchTerm) ||
        line.balance.toString().includes(searchTerm)
      );
    });

    setLedger(searched);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Ledger</h1>

      {/* 🔍 Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          className="border p-2"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
        >
          <option value="">Select Account</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
        />
        <input
          type="date"
          className="border p-2"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />

        <input
          type="text"
          placeholder="Search anything..."
          className="border p-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={computeLedger}
        >
          Show Ledger
        </button>
      </div>

      {/* Ledger Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Voucher No</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Debit</th>
            <th className="border p-2">Credit</th>
            <th className="border p-2">Balance</th>
          </tr>
        </thead>
        <tbody>
          {ledger.map((line, idx) => (
            <tr key={idx}>
              <td className="border p-2">{line.date}</td>
              <td className="border p-2">{line.voucher_no}</td>
              <td className="border p-2">{line.description}</td>
              <td className="border p-2">{line.debit}</td>
              <td className="border p-2">{line.credit}</td>
              <td className="border p-2">{line.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LedgerManager;
