import { ArrowLeft, Eye, ChevronDown } from "lucide-react";
import Table from "@/components/Table"; // Adjust path if needed

const salesData = [
  {
    sno: "01",
    projectName: "Flex Sign Board",
    coordinator: "Abhay Sindh",
    salesExec: "Aman",
    paymentStatus: "Initial Paid",
    completionDate: "Nov 15, 2024",
    urgency: "High",
    status: "Pending",
  },
  {
    sno: "02",
    projectName: "LED Channel Letter Signage",
    coordinator: "Abhay Sindh",
    salesExec: "Aman",
    paymentStatus: "Pending",
    completionDate: "Nov 15, 2024",
    urgency: "High",
    status: "Pending",
  },
  {
    sno: "03",
    projectName: "Acrylic Sign Board",
    coordinator: "Abhay Sindh",
    salesExec: "Aman",
    paymentStatus: "Pending",
    completionDate: "Nov 15, 2024",
    urgency: "Low",
    status: "Under Process",
  },
  {
    sno: "04",
    projectName: "Vinyl Cut Signage",
    coordinator: "Abhay Sindh",
    salesExec: "Aman",
    paymentStatus: "Full Paid",
    completionDate: "Nov 15, 2024",
    urgency: "Low",
    status: "Completed",
  },
  {
    sno: "05",
    projectName: "Glow Sign Board",
    coordinator: "Abhay Sindh",
    salesExec: "Aman",
    paymentStatus: "Full Paid",
    completionDate: "Nov 15, 2024",
    urgency: "High",
    status: "Completed",
  },
  {
    sno: "06",
    projectName: "LED Channel Letter Signage",
    coordinator: "Abhay Sindh",
    salesExec: "Aman",
    paymentStatus: "Full Paid",
    completionDate: "Nov 15, 2024",
    urgency: "Low",
    status: "Completed",
  },
];

// Styles for badges
const badgeStyles = {
  paymentStatus: {
    "Initial Paid": "bg-blue-100 text-blue-600",
    Pending: "bg-orange-100 text-orange-600",
    "Full Paid": "bg-green-100 text-green-600",
  },
  urgency: {
    High: "bg-red-600 text-white",
    Low: "bg-blue-600 text-white",
  },
  status: {
    Pending: "bg-orange-100 text-orange-600",
    "Under Process": "bg-blue-100 text-blue-600",
    Completed: "bg-green-100 text-green-600",
  },
};

const columnConfig = {
  sno: { label: "Sr. No" },
  projectName: { label: "Project Name" },
  coordinator: { label: "Project Co-ordinator" },
  salesExec: { label: "Sales Executive" },
  paymentStatus: {
    label: "Payment Status",
    render: (val) => (
      <span
        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${badgeStyles.paymentStatus[val] || "bg-gray-200 text-gray-800"
          }`}
      >
        {val}
      </span>
    ),
  },
  completionDate: { label: "Completion Date" },
  urgency: {
    label: "Urgency",
    render: (val) => (
      <span
        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${badgeStyles.urgency[val] || "bg-gray-200 text-gray-800"
          }`}
      >
        {val}
      </span>
    ),
  },
  status: {
    label: "Status",
    render: (val) => (
      <span
        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${badgeStyles.status[val] || "bg-gray-200 text-gray-800"
          }`}
      >
        {val}
      </span>
    ),
  },
  action: {
    label: "Action",
    render: () => (
      <button
        className="bg-blue-600 p-1 rounded text-white hover:bg-blue-700"
        aria-label="View details"
      >
        <Eye size={18} />
      </button>
    ),
  },
};

export default function SalesDepartmentPage() {
  return (
    <div>

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between mb-5 bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 border rounded hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-semibold text-slate-800">
            Sales Department
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* <input
            type="text"
            placeholder="Search here"
            className="px-4 py-2 bg-slate-100 rounded text-sm w-60 focus:outline-none"
          /> */}

          {["Urgency", "Status", "Sales Executive"].map((f) => (
            <button
              key={f}
              className="flex items-center gap-2 px-3 py-2 border rounded text-sm text-slate-600 hover:bg-slate-50"
            >
              {f}
              <ChevronDown size={14} />
            </button>
          ))}
        </div>
      </div>


      {/* Table container */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <Table data={salesData} columnConfig={columnConfig} />
      </div>


    </div>
  );
}
