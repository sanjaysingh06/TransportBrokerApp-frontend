import React from "react";

const formatNumber = (v) =>
  v !== null && v !== undefined && !isNaN(v) ? Number(v).toFixed(2) : "0.00";

const ReceiptTable = ({ receipts, onEdit, onDelete }) => {
  return (
    <div className="p-4">
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100 border text-left">
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Receipt No</th>
            <th className="border px-2 py-1">Transport</th>
            <th className="border px-2 py-1">Party</th>
            <th className="border px-2 py-1">Freight</th>
            <th className="border px-2 py-1">Comm</th>
            <th className="border px-2 py-1">Cartage</th>
            <th className="border px-2 py-1">Labour</th>
            <th className="border px-2 py-1">Other</th>
            <th className="border px-2 py-1">Delivery Charge</th>
            <th className="border px-2 py-1">Total</th>
            <th className="border px-2 py-1 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {receipts.length > 0 ? (
            receipts.map((r) => (
              <tr key={r.id} className="border hover:bg-gray-50">
                <td className="border px-2 py-1">{r.date}</td>
                <td className="border px-2 py-1">{r.receipt_no}</td>
                <td className="border px-2 py-1">
                  {r.transport_account?.name || "-"}
                </td>
                <td className="border px-2 py-1">
                  {r.party_account?.name || "-"}
                </td>
                <td className="border px-2 py-1">{formatNumber(r.freight)}</td>
                <td className="border px-2 py-1">{formatNumber(r.comm)}</td>
                <td className="border px-2 py-1">{formatNumber(r.cartage)}</td>
                <td className="border px-2 py-1">{formatNumber(r.labour)}</td>
                <td className="border px-2 py-1">{formatNumber(r.other)}</td>
                <td className="border px-2 py-1">
                  {formatNumber(r.delivery_charge)}
                </td>
                <td className="border px-2 py-1 font-semibold">
                  {formatNumber(r.total)}
                </td>
                <td className="border px-2 py-1 text-center space-x-2">
                  <button
                    onClick={() => onEdit(r)}
                    className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this receipt?"
                        )
                      ) {
                        onDelete(r.id); // ✅ only send the ID
                      }
                    }}
                    className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-2 py-3 text-center" colSpan={12}>
                No receipts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReceiptTable;
