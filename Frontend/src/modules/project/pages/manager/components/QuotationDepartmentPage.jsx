import { ArrowLeft, Eye, ChevronDown } from "lucide-react";
import Table from "@/components/Table"; // Adjust path if needed
import { useNavigate } from "react-router-dom";

const quotationData = [
  {
    clientName: "Aman",
    projectName: "Flex Sign Board",
    coordinator: "Abhay Sindh",
    productCount: "5",
    typeOfWork: "Fresh",
    quotationExec: "Aman",
    urgency: "High",
    priority: "1",
    quotationDeadline: "Nov 15, 2024 10:00 AM",
    completionDate: "Nov 15, 2024",
    status: "Pending",
  },
  {
    clientName: "Aman",
    projectName: "Flex Sign Board",
    coordinator: "Abhay Sindh",
    productCount: "5",
    typeOfWork: "Repairing",
    quotationExec: "Aman",
    urgency: "Low",
    priority: "1",
    quotationDeadline: "Nov 15, 2024 10:00 AM",
    completionDate: "Nov 15, 2024",
    status: "Completed",
  },
  {
    clientName: "Aman",
    projectName: "Flex Sign Board",
    coordinator: "Abhay Sindh",
    productCount: "5",
    typeOfWork: "Repairing",
    quotationExec: "Aman",
    urgency: "Low",
    priority: "1",
    quotationDeadline: "Nov 15, 2024 10:00 AM",
    completionDate: "Nov 15, 2024",
    status: "Pending",
  },
  {
    clientName: "Aman",
    projectName: "Flex Sign Board",
    coordinator: "Abhay Sindh",
    productCount: "5",
    typeOfWork: "Fresh",
    quotationExec: "Aman",
    urgency: "Low",
    priority: "1",
    quotationDeadline: "Nov 15, 2024 10:00 AM",
    completionDate: "Nov 15, 2024",
    status: "Pending",
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
  waitingStatus: {
    "Hold by Client": "bg-red-600 text-white",
    "Hold by Company": "bg-blue-600 text-white",
  },
  leadType: {
    Hot: "bg-red-100 text-orange-600",
    Warm: "bg-orange-100 text-orange-600",
    Cold: "bg-blue-100 text-green-600"
  },
  typeOfWork: {
    Fresh: "bg-blue-100 text-blue-600",
    Repairing: "bg-orange-100 text-orange-600",
  }
};

const columnConfig = {
  clientName: { label: "Cleint Name" },
  projectName: { label: "Project Name" },
  coordinator: { label: "Project Co-ordinator" },
  productCount: { label: "Product Count" },
  typeOfWork: {
    label: "Type Of Work",
    render: (val) => (
      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${badgeStyles.typeOfWork[val] || "bg-gray-200 text-gray-800"}`}>
        {val}
      </span>
    ),
  },
  quotationExec: { label: "Quotation Executive" },
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
  priority: { label: "Priority" },
  quotationDeadline: { label: "Quotation Deadline" },
  completionDate: { label: "Completion Deadline" },
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


const waitingData = [
  {
    department: "Quotation",
    waitingInDate: "Nov 15, 2024",
    lastInteraction: "Nov 15, 2024 - 10:00AM",
    productName: "ABC Product",
    projectName: "Flex Sign Board ",
    waitingTime: "1 Day, 6 hrs, 5 minutes",
    status: "Hold by Client",
    priority: "1",
    leadType: "Hot",
  },
  {
    department: "Quotation",
    waitingInDate: "Nov 15, 2024",
    lastInteraction: "Nov 15, 2024 - 10:00AM",
    productName: "ABC Product",
    projectName: "Flex Sign Board ",
    waitingTime: "1 Day, 6 hrs, 5 minutes",
    status: "Hold by Company",
    priority: "1",
    leadType: "Hot",
  },
  {
    department: "Quotation",
    waitingInDate: "Nov 15, 2024",
    lastInteraction: "Nov 15, 2024 - 10:00AM",
    productName: "ABC Product",
    projectName: "Flex Sign Board ",
    waitingTime: "1 Day, 6 hrs, 5 minutes",
    status: "Hold by Client",
    priority: "4",
    leadType: "Warm",
  },
  {
    department: "Quotation",
    waitingInDate: "Nov 15, 2024",
    lastInteraction: "Nov 15, 2024 - 10:00AM",
    productName: "ABC Product",
    projectName: "Flex Sign Board ",
    waitingTime: "1 Day, 6 hrs, 5 minutes",
    status: "Hold by Client",
    priority: "5",
    leadType: "Cold",
  }
];


const waitingColumnConfig = {
  department: { label: "Department" },
  waitingInDate: { label: "Waiting In Date" },
  lastInteraction: { label: "Last Interaction" },
  productName: { label: "Product Name" },
  projectName: { label: "Project Name" },
  waitingTime: { lable: "Waiting Time" },

  status: {
    label: "Status",
    render: (val) => (
      <span
        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${badgeStyles.waitingStatus[val] || "bg-gray-200 text-gray-800"
          }`}
      >
        {val}
      </span>
    ),
  },
  priority: { label: "Priority" },
  leadType: {
    label: "Lead Type",
    render: (val) => (
      <span
        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${badgeStyles.leadType[val] || "bg-gray-200 text-gray-800"
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


export default function QuotationDepartmentPage() {
  const navigate = useNavigate();

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
            Quotation Department
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {["Urgency", "Status", "Quotation Executive"].map((f) => (
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
        <Table data={quotationData} columnConfig={columnConfig} />
      </div>

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between my-5 bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 border rounded hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-semibold text-slate-800">
            Waiting Works
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {["Urgency", "Status", "Quotation Executive"].map((f) => (
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
        <Table data={waitingData} columnConfig={waitingColumnConfig} />
      </div>


    </div>
  );
}
