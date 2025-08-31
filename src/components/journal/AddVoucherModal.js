import React, { useState, useEffect } from "react";
import AccountService from "../../services/AccountService";
import JournalService from "../../services/JournalService";

const AddVoucherModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    voucher_no: "",
    description: "",
    narration: "",
    type: "Receipt",
    cash_account: "",
    party_account: "",
    amount: 0,
  });

  // Hardcoded cash/bank accounts for now
  const cashAccounts = [
    { id: 3, name: "CASH IN HAND" },
    { id: 4, name: "BANK ACCOUNT" },
  ];

  // Party accounts for Receipt/Payment – can be loaded from backend
  const [partyAccounts, setPartyAccounts] = useState([]);

  useEffect(() => {
    if (form.type === "Receipt" || form.type === "Payment") {
      fetchPartyAccounts();
    }
  }, [form.type]);

  const fetchPartyAccounts = async () => {
    try {
      const res = await AccountService.getAccounts();
      const parties = res.data.filter(a => !["CASH IN HAND", "BANK ACCOUNT", "Income", "Expense"].includes(a.name));
      setPartyAccounts(parties);
    } catch (error) {
      console.error("Failed to fetch party accounts:", error);
    }
  };

  const handleSave = async () => {
    if (!form.amount || !form.voucher_no || !form.description || !form.cash_account) {
      alert("Please fill all required fields!");
      return;
    }

    // Determine counterparty account
    let counterAccountId = null;
    if (form.type === "Income") counterAccountId = 3; // Income account id
    if (form.type === "Expense") counterAccountId = 4; // Expense account id
    if (form.type === "Receipt" || form.type === "Payment") counterAccountId = parseInt(form.party_account);

    if (!counterAccountId) {
      alert("Counterparty account not found!");
      return;
    }

    // Generate journal lines
    const amount = parseFloat(form.amount);
    const cashAccId = parseInt(form.cash_account);
    let lines = [];

    switch (form.type) {
      case "Receipt":
      case "Income":
        lines = [
          { account: cashAccId, debit: amount, credit: 0 },
          { account: counterAccountId, debit: 0, credit: amount },
        ];
        break;
      case "Payment":
      case "Expense":
        lines = [
          { account: counterAccountId, debit: amount, credit: 0 },
          { account: cashAccId, debit: 0, credit: amount },
        ];
        break;
      default:
        alert("Invalid voucher type!");
        return;
    }

    const payload = {
      date: form.date,
      voucher_no: form.voucher_no,
      description: form.description,
      narration: form.narration,
      lines: lines,
    };

    try {
      await JournalService.createJournalEntry(payload);
      onSaved();
      onClose();
    } catch (error) {
      console.error("Failed to save voucher:", error.response?.data || error.message);
      alert("Error saving voucher: " + JSON.stringify(error.response?.data || error.message));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-4">Add Voucher</h2>

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value, party_account: "" })}
          className="border p-2 w-full mb-2"
        >
          <option value="Receipt">Receipt</option>
          <option value="Payment">Payment</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        {/* Cash/Bank Account */}
        <select
          value={form.cash_account || ""}
          onChange={(e) => setForm({ ...form, cash_account: e.target.value })}
          className="border p-2 w-full mb-2"
        >
          <option value="">Select Cash/Bank Account</option>
          {cashAccounts.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        {/* Party Account for Receipt/Payment */}
        {(form.type === "Receipt" || form.type === "Payment") && (
          <select
            value={form.party_account || ""}
            onChange={(e) => setForm({ ...form, party_account: e.target.value })}
            className="border p-2 w-full mb-2"
          >
            <option value="">Select Party Account</option>
            {partyAccounts.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        )}

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Voucher No"
          value={form.voucher_no}
          onChange={(e) => setForm({ ...form, voucher_no: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Narration"
          value={form.narration}
          onChange={(e) => setForm({ ...form, narration: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 border rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddVoucherModal;
