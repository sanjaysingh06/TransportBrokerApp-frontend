import React, { useEffect, useState } from "react";
import AccountService from "../../services/AccountService";

const AccountTypeManager = () => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", description: "" });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    const res = await AccountService.getAccountTypes();
    setAccountTypes(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.code) return;

    if (editing) {
      await AccountService.updateAccountType(editing.id, form);
      setEditing(null);
    } else {
      await AccountService.createAccountType(form);
    }

    setForm({ name: "", code: "", description: "" });
    fetchTypes();
  };

  const handleEdit = (type) => {
    setEditing(type);
    setForm({ name: type.name, code: type.code, description: type.description || "" });
  };

  const handleDelete = async (id) => {
    await AccountService.deleteAccountType(id);
    fetchTypes();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Account Types</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Type name"
          className="border p-2 rounded w-1/3"
        />
        <input
          type="text"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          placeholder="Code"
          className="border p-2 rounded w-1/4"
        />
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="border p-2 rounded w-1/3"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editing ? "Update" : "Add"}
        </button>
      </form>

      <ul>
        {accountTypes.map((type) => (
          <li key={type.id} className="flex justify-between items-center mb-2 border-b pb-1">
            {type.code} - {type.name} ({type.description || "No description"})
            <div className="flex gap-2">
              <button onClick={() => handleEdit(type)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(type.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountTypeManager;
