import SummaryCard from "../../components/payments/SummaryCard"
import InvoiceTable from "../../components/payments/InvoiceTable"
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom"


export default function PaymentDetails() {

  const navigate = useNavigate()

  return (
    <div className="">

      {/* Header */}
      <div className="bg-white border rounded-lg p-4 mb-6 flex items-center gap-3">
        <button className="text-xl cursor-pointer" onClick={() => navigate(-1)}>
          <Icons.ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Payment Details</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="Total Project Value"
          amount="₹124,500.00"
          footer="Includes GST"
          color="blue"
        />
        <SummaryCard
          title="Total Paid"
          amount="₹87,150.00"
          footer="70% of total value"
          color="green"
        />
        <SummaryCard
          title="Pending Balance"
          amount="₹37,350.00"
          footer="Due by Oct 30, 2024"
          color="orange"
        />
      </div>

      {/* Invoice History */}
      <InvoiceTable />
    </div>
  )
}
