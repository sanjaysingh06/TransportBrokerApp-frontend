import React, { useState } from "react";
import ReportService from "../../services/ReportService";

const LedgerReport = () => {
  const [filters, setFilters] = useState({
    account_id: "",
    start_date: "",
    end_date: "",
    transaction_type: "",
  });

  const [ledgerData, setLedgerData] = useState(null);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchLedger = async () => {
    try {
      const data = await ReportService.getLedger(filters);
      setLedgerData(data);
    } catch (error) {
      alert("Failed to fetch ledger");
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Ledger Report</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="account_id"
          placeholder="Account ID"
          value={filters.account_id}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="start_date"
          value={filters.start_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="end_date"
          value={filters.end_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="transaction_type"
          value={filters.transaction_type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>
      </div>

      <button
        onClick={fetchLedger}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get Ledger
      </button>

      {/* Ledger Data */}
      {ledgerData && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Transactions</h3>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Date</th>
                <th className="border p-2">Voucher</th>
                <th className="border p-2">Debit</th>
                <th className="border p-2">Credit</th>
              </tr>
            </thead>
            <tbody>
              {ledgerData.transactions.map((txn, index) => (
                <tr key={index}>
                  <td className="border p-2">{txn.date}</td>
                  <td className="border p-2">{txn.voucher_number}</td>
                  <td className="border p-2">{txn.debit}</td>
                  <td className="border p-2">{txn.credit}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-4">
            <p><strong>Opening Balance:</strong> {ledgerData.opening_balance}</p>
            <p><strong>Total Debit:</strong> {ledgerData.total_debit}</p>
            <p><strong>Total Credit:</strong> {ledgerData.total_credit}</p>
            <p><strong>Closing Balance:</strong> {ledgerData.closing_balance}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LedgerReport;
