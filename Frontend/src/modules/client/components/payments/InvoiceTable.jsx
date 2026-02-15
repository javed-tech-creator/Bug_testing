  import * as Icons from "lucide-react";
import InvoiceDownload from "../dashboard/InvoiceDownload";
const invoices = [
  {
    no: "INV-2024-042",
    date: "Oct 20, 2024",
    amount: "₹37,350.00",
    status: "Pending",
  },
  {
    no: "INV-2024-042",
    date: "Oct 20, 2024",
    amount: "₹37,350.00",
    status: "Paid",
  },
  {
    no: "INV-2024-042",
    date: "Oct 20, 2024",
    amount: "₹37,350.00",
    status: "Paid",
  },
]

export default function InvoiceTable() {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold">Invoice History</h3>
        <button className="border flex gap-2 border-white px-3 py-1 rounded-md text-[12px]">
          <Icons.Download size={16} /> Download Statement
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">Invoice No</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{inv.no}</td>
                <td className="p-3">{inv.date}</td>
                <td className="p-3">{inv.amount}</td>
                <td className="p-3">
                  <StatusBadge status={inv.status} />
                </td>
                <td className="p-3 text-center">
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

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-600",
    Paid: "bg-green-100 text-green-600",
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
      {status}
    </span>
  )
}
    