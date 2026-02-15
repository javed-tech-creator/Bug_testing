import { X, Eye } from "lucide-react";
import { useState } from "react";
import InvoiceDownload from "../dashboard/InvoiceDownload";

export default function InvoiceModal({ title, onClose }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const invoices = [
    { id: "INV-2024-042", date: "Oct 20, 2024", amount: "₹7,350.00", status: "Pending" },
    { id: "INV-2024-042", date: "Oct 20, 2024", amount: "₹7,350.00", status: "Paid" },
    { id: "INV-2024-042", date: "Oct 20, 2024", amount: "₹7,350.00", status: "Paid" },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-[720px] rounded-md shadow-lg relative text-[12px]">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-sm flex items-center justify-center"
            >
              <X size={14} />
            </button>
          </div>

          {/* Table */}
          <div className="p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="pb-2 font-medium">{title} No</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((inv, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 text-gray-700">{inv.id}</td>
                    <td className="py-3 text-gray-600">{inv.date}</td>
                    <td className="py-3 text-gray-700">{inv.amount}</td>
                    <td className="py-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => setSelectedInvoice(inv)}
                          className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center cursor-pointer hover:bg-blue-200 transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                        <InvoiceDownload invoice={inv} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Preview Modal */}
      {selectedInvoice && (
        <InvoicePreviewModal 
          invoice={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}
    </>
  );
}

function InvoicePreviewModal({ invoice, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-white w-[500px] rounded-md shadow-xl relative text-[12px]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800 text-sm">Invoice Details</h2>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-sm flex items-center justify-center"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 font-medium mb-1">Invoice Number</p>
              <p className="text-gray-800 font-semibold">{invoice.id}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">Date</p>
              <p className="text-gray-800">{invoice.date}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">Amount</p>
              <p className="text-gray-800 font-semibold text-lg">{invoice.amount}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">Status</p>
              <StatusBadge status={invoice.status} />
            </div>
          </div>

          {/* Additional Details */}
          <div className="border-t pt-4 mt-4">
            <p className="text-gray-500 font-medium mb-2">Description</p>
            <p className="text-gray-700">Monthly subscription charges and services</p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-sm font-medium text-sm"
          >
            Close
          </button>
          <InvoiceDownload invoice={invoice} />
        </div>

      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const base =
    "px-2 py-[2px] rounded-full text-[11px] font-medium inline-block";

  if (status === "Pending")
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;

  return <span className={`${base} bg-green-100 text-green-700`}>Paid</span>;
}