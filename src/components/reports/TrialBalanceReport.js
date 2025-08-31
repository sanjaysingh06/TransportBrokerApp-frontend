// src/components/reports/TrialBalanceReport.js
import React, { useEffect, useState } from "react";
import ReportService from "../../services/ReportService";

const TrialBalanceReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await ReportService.getTrialBalance();
        setReportData(data);
      } catch (err) {
        setError("Failed to fetch trial balance");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <p>Loading Trial Balance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!reportData) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Trial Balance</h2>

      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Account Code</th>
            <th className="border p-2">Account Name</th>
            <th className="border p-2">Debit</th>
            <th className="border p-2">Credit</th>
            <th className="border p-2">Closing Balance</th>
          </tr>
        </thead>
        <tbody>
          {reportData.accounts && reportData.accounts.length > 0 ? (
            reportData.accounts.map((acc) => (
              <tr key={acc.account_id}>
                <td className="border p-2">{acc.account_code}</td>
                <td className="border p-2">{acc.account_name}</td>
                <td className="border p-2">{acc.debit_total}</td>
                <td className="border p-2">{acc.credit_total}</td>
                <td className="border p-2">{acc.closing_balance}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-2">
                No accounts found
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="font-bold bg-gray-100">
            <td className="border p-2" colSpan="2">
              Totals
            </td>
            <td className="border p-2">{reportData.total_debit}</td>
            <td className="border p-2">{reportData.total_credit}</td>
            <td className="border p-2">
              {reportData.is_balanced ? "Balanced" : "Not Balanced"}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TrialBalanceReport;
