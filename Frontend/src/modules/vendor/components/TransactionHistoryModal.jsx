import React, { useState } from "react";
import { X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const dummyTransactions = [
  {
    id: "TXN001",
    date: "2024-06-15",
    quantity: 5,
    status: "Completed",
    paymentStatus: "Paid",
    remarks: "Delivered on time",
    paymentMode: "Online",
  },
  {
    id: "TXN002",
    date: "2024-06-18",
    quantity: 3,
    status: "Dispatched",
    paymentStatus: "Pending",
    remarks: "Expected by next week",
    paymentMode: "COD",
  },
  {
    id: "TXN003",
    date: "2024-06-22",
    quantity: 2,
    status: "Completed",
    paymentStatus: "Paid",
    remarks: "Fast delivery",
    paymentMode: "Bank Transfer",
  },
   {
    id: "TXN004",
    date: "2024-06-15",
    quantity: 5,
    status: "Completed",
    paymentStatus: "Paid",
    remarks: "Delivered on time",
    paymentMode: "Online",
  },
  {
    id: "TXN005",
    date: "2024-06-18",
    quantity: 3,
    status: "Dispatched",
    paymentStatus: "Pending",
    remarks: "Expected by next week",
    paymentMode: "COD",
  },
  {
    id: "TXN006",
    date: "2024-06-22",
    quantity: 2,
    status: "Completed",
    paymentStatus: "Paid",
    remarks: "Fast delivery",
    paymentMode: "Bank Transfer",
  },
   {
    id: "TXN007",
    date: "2024-06-15",
    quantity: 5,
    status: "Completed",
    paymentStatus: "Paid",
    remarks: "Delivered on time",
    paymentMode: "Online",
  },
  {
    id: "TXN008",
    date: "2024-06-18",
    quantity: 3,
    status: "Dispatched",
    paymentStatus: "Pending",
    remarks: "Expected by next week",
    paymentMode: "COD",
  },
  {
    id: "TXN009",
    date: "2024-06-22",
    quantity: 2,
    status: "Completed",
    paymentStatus: "Paid",
    remarks: "Fast delivery",
    paymentMode: "Bank Transfer",
  },
  // ... other transactions
];

const TransactionHistoryModal = ({ product, onClose }) => {
  const [searchInput, setSearchInput] = useState("");

  const filteredData = dummyTransactions.filter((txn) => {
    const query = searchInput.toLowerCase();
    return (
      txn.id.toLowerCase().includes(query) ||
      txn.status.toLowerCase().includes(query)
    );
  });

  const handlePDFDownload = () => {
    const doc = new jsPDF();
    doc.text(`Transaction History – ${product.productName}`, 14, 16);

    autoTable(doc, {
      startY: 22,
      head: [["Txn ID", "Date", "Qty", "Status", "Payment", "Payment Mode", "Remarks"]],
      body: filteredData.map((txn) => [
        txn.id,
        txn.date,
        txn.quantity,
        txn.status,
        txn.paymentStatus,
        txn.paymentMode,
        txn.remarks,
      ]),
    });

    doc.save(`${product.productCode}_transactions.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            🧾 Transaction History – {product.productName}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X size={22} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 mb-2 flex items-center justify-between">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="🔍 Search by Txn ID or status..."
            className="border px-3 py-2 rounded w-64 text-sm focus:outline-none"
          />
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto max-h-[60vh] rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Txn ID</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Date</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Quantity</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Status</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Payment</th>
                <th className="px-4 py-3 font-semibold border-r border-gray-200">Payment Mode</th>
                <th className="px-4 py-3 font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((txn) => (
                  <tr key={txn.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 text-gray-800">{txn.id}</td>
                    <td className="px-4 py-3 text-gray-700">{txn.date}</td>
                    <td className="px-4 py-3 text-gray-700">{txn.quantity}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          txn.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : txn.status === "Dispatched"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          txn.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {txn.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{txn.paymentMode}</td>
                    <td className="px-4 py-3 text-gray-700">{txn.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                    No matching transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Buttons */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={handlePDFDownload}
            className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryModal;
