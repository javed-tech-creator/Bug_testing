import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import InvoiceDownload from "./InvoiceDownload";

export default function PendingInvoices() {
  const navigate = useNavigate();
  const invoices = Array(3).fill({
    no: "INV-2024-042",
    date: "Oct 20, 2024",
    amount: "₹37,350.00",
    status: "Pending",
  })

  return (
    <div className="bg-white rounded-lg border mt-6">
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold rounded-t-lg">
        Pending Invoices
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Invoice No</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Status</th>
              <th className="text-center p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{inv.no}</td>
                <td className="p-3">{inv.date}</td>
                <td className="p-3">{inv.amount}</td>
                <td className="p-3">
                  <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs">
                    Pending
                  </span>
                </td>
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => navigate("/client/project-list/project/24/quotation")}
                    className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center cursor-pointer hover:bg-blue-200 transition-colors"
                  >
                    <Icons.Eye size={20} />
                  </button>
                  <InvoiceDownload invoice={inv} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
