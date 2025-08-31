import React, { useEffect, useState } from "react";
import JournalService from "../../services/JournalService";
import AddVoucherModal from "./AddVoucherModal";

const JournalManager = () => {
  const [journals, setJournals] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await JournalService.getJournalEntries();
      setJournals(res.data);
    } catch (error) {
      console.error("Failed to fetch vouchers:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Vouchers</h1>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setShowModal(true)}
        >
          Add Voucher
        </button>
      </div>

      {showModal && (
        <AddVoucherModal
          onClose={() => setShowModal(false)}
          onSaved={() => {
            fetchEntries();
            setShowModal(false);
          }}
        />
      )}

      <table className="w-full border">
        <thead>
          <tr className="border">
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Voucher No</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Account</th>
            <th className="border px-2 py-1">Debit</th>
            <th className="border px-2 py-1">Credit</th>
          </tr>
        </thead>
        <tbody>
          {journals.map((j) => (
            <React.Fragment key={j.id}>
              {j.lines.map((line, idx) => (
                <tr key={idx} className="border">
                  {idx === 0 && (
                    <>
                      <td className="border px-2 py-1" rowSpan={j.lines.length}>{j.date}</td>
                      <td className="border px-2 py-1" rowSpan={j.lines.length}>{j.voucher_no}</td>
                      <td className="border px-2 py-1" rowSpan={j.lines.length}>{j.description}</td>
                    </>
                  )}
                  <td className="border px-2 py-1">{line.account_name}</td>
                  <td className="border px-2 py-1">{line.debit}</td>
                  <td className="border px-2 py-1">{line.credit}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JournalManager;
