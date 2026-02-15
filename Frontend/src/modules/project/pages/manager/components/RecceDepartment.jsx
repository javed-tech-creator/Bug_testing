import { ArrowLeft, Eye, ChevronDown } from "lucide-react";
import Table from "@/components/Table"; // Adjust path if needed

const recceData = [
  {
    sno: "01",
    projectName: "Flex Sign Board",
    coordinator: "Abhay Sindh",
    recceExec: "Aman",
    recceDeadline: "Nov 15,2025",
    paymentStatus: "Initial Paid",
    completionDate: "Nov 15, 2024",
    urgency: "High",
    status: "Pending",
  },
  {
    sno: "02",
    projectName: "LED Channel Letter Signage",
    coordinator: "Abhay Sindh",
    recceExec: "William", // was salesExec
    recceDeadline: "Nov 15, 2026",
    paymentStatus: "Pending",
    completionDate: "Nov 15, 2024",
    urgency: "High",
    status: "Pending",
  },
  {
    sno: "03",
    projectName: "Acrylic Sign Board",
    coordinator: "Abhay Sindh",
    recceExec: "William",
    recceDeadline: "Nov 15, 2026",
    paymentStatus: "Pending",
    completionDate: "Nov 15, 2024",
    urgency: "Low",
    status: "Under Process",
  },
  {
    sno: "04",
    projectName: "Vinyl Cut Signage",
    coordinator: "Abhay Sindh",
    recceExec: "",
    recceDeadline: "",
    paymentStatus: "Full Paid",
    completionDate: "Nov 15, 2024",
    urgency: "Low",
    status: "Completed",
  },
  {
    sno: "05",
    projectName: "Glow Sign Board",
    coordinator: "Abhay Sindh",
    recceExec: "",
    recceDeadline: "",
    paymentStatus: "Full Paid",
    completionDate: "Nov 15, 2024",
    urgency: "High",
    status: "Completed",
  },
  {
    sno: "06",
    projectName: "LED Channel Letter Signage",
    coordinator: "Abhay Sindh",
    recceExec: "",
    recceDeadline: "",
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
  projectName: { label: "Project Name" },
  coordinator: { label: "Project Co-ordinator" },
  recceExec: { label: "Recce Executive" }, // updated key from salesExec
  recceDeadline: { label: "Recce Deadline" }, // added new column
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



const waitingData = [
  {
    department: "Recce",
    waitingInData: "Nov 15, 2024",
    lastIneraction: "Nov 15, 2024",
    productName: "ABC Product",
    projectName: "Flex Sign Board",
    waitingTime: "1 Day, 6hrs, 5 Minutes",
    status: "Pending",
    priority: 1,
    leadType: "Hot",
  },
  {
    department: "Recce",
    waitingInData: "Nov 16, 2024",
    lastIneraction: "Nov 15, 2024",
    productName: "LED Product",
    projectName: "LED Channel Letter Signage",
    waitingTime: "2 Days, 3hrs, 10 Minutes",
    status: "Pending",
    priority: 1,
    leadType: "Hot",
  },
  {
    department: "Recce",
    waitingInData: "Nov 17, 2024",
    lastIneraction: "Nov 16, 2024",
    productName: "Acrylic Product",
    projectName: "Acrylic Sign Board",
    waitingTime: "3 Days, 2hrs, 30 Minutes",
    status: "Under Process",
    priority: 2,
    leadType: "Warm",
  },
  {
    department: "Recce",
    waitingInData: "Nov 18, 2024",
    lastIneraction: "Nov 17, 2024",
    productName: "Vinyl Product",
    projectName: "Vinyl Cut Signage",
    waitingTime: "1 Day, 8hrs, 15 Minutes",
    status: "Completed",
    priority: 3,
    leadType: "Cold",
  },
  {
    department: "Recce",
    waitingInData: "Nov 19, 2024",
    lastIneraction: "Nov 18, 2024",
    productName: "Glow Product",
    projectName: "Glow Sign Board",
    waitingTime: "2 Days, 4hrs, 0 Minutes",
    status: "Completed",
    priority: 2,
    leadType: "Warm",
  },
  {
    department: "Recce",
    waitingInData: "Nov 20, 2024",
    lastIneraction: "Nov 19, 2024",
    productName: "LED Product",
    projectName: "LED Channel Letter Signage",
    waitingTime: "1 Day, 5hrs, 20 Minutes",
    status: "Completed",
    priority: 3,
    leadType: "Cold",
  },
];


const waitingColumnConfig = {
  department: { label: "Department" },
  waitingInData: { label: "Waiting In Data" },
  lastIneraction: { label: "Last Interaction" },
  productName: { label: "Product Name" },
  projectName: { label: "Project Name" },
  waitingTime: { label: "Waiting Time" },
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
  priority: {
    label: "Priority",
    render: (val) => {
      const key = String(val); // convert number to string
      return (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${(badgeStyles.priority && badgeStyles.priority[key]) || "bg-gray-200 text-gray-800"
            }`}
        >
          {val}
        </span>
      );
    },
  },

  leadType: { label: "Lead Type" },
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


export default function RecceDepartmentPage() {
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
            Recce Department
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {["Urgency", "Status", "Recce Executive"].map((f) => (
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
        <Table data={recceData} columnConfig={columnConfig} />
      </div>

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between mt-5 mb-5 bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-slate-800">
            Waiting Works
          </h1>
        </div>
      </div>


      {/* Table container */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <Table data={waitingData} columnConfig={waitingColumnConfig} />
      </div>



    </div>
  );
}
