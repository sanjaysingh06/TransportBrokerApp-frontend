import React, { useEffect, useState } from "react";
import AccountService from "../../services/AccountService";

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    account_type: "",
    code: "",
    parent: "",
    opening_balance: "0.00",
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchAccounts();
    fetchTypes();
  }, []);

  const fetchAccounts = async () => {
    const res = await AccountService.getAccounts();
    setAccounts(res.data);
  };

  const fetchTypes = async () => {
    const res = await AccountService.getAccountTypes();
    setAccountTypes(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.account_type || !form.code) return;

    if (editing) {
      await AccountService.updateAccount(editing.id, form);
      setEditing(null);
    } else {
      await AccountService.createAccount(form);
    }

    setForm({ name: "", account_type: "", code: "", parent: "", opening_balance: "0.00" });
    fetchAccounts();
  };

  const handleEdit = (account) => {
    setEditing(account);
    setForm({
      name: account.name,
      account_type: account.account_type,
      code: account.code,
      parent: account.parent || "",
      opening_balance: account.opening_balance,
    });
  };

  const handleDelete = async (id) => {
    await AccountService.deleteAccount(id);
    fetchAccounts();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Accounts</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-2 mb-4">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Account name"
          className="border p-2 rounded"
        />
        <input
          type="text"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          placeholder="Code"
          className="border p-2 rounded"
        />
        <select
          value={form.account_type}
          onChange={(e) => setForm({ ...form, account_type: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select type</option>
          {accountTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
        <select
          value={form.parent}
          onChange={(e) => setForm({ ...form, parent: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">No parent</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </select>
        <input
          type="number"
          value={form.opening_balance}
          onChange={(e) => setForm({ ...form, opening_balance: e.target.value })}
          placeholder="Opening Balance"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded col-span-5">
          {editing ? "Update" : "Add"}
        </button>
      </form>

      <ul>
        {accounts.map((acc) => (
          <li key={acc.id} className="flex justify-between items-center mb-2 border-b pb-1">
            {acc.code} - {acc.name} ({acc.account_type_name})
            <div className="flex gap-2">
              <button onClick={() => handleEdit(acc)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(acc.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountManager;
