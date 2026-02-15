import React from "react";
import PlanningLogModal from "../components/PlanningLogModal";
import Table from "@/components/Table"; // Assuming your Table component is here
import {
  ArrowLeft,
  SlidersHorizontal,
  Filter,
  User,
  Eye,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SalesDepartment = () => {
  const navigate = useNavigate();
  const [openPlanningLogId, setOpenPlanningLogId] = React.useState(null);
  // 1. Mock Data matching the screenshot
  const salesData = [
    {
      id: 1,
      projectName: "Flex Sign Board",
      coordinator: "Abhay Sindh",
      executive: "Aman",
      paymentStatus: "Initial Paid",
      completionDate: "Nov 15, 2024",
      urgency: "High",
      status: "Pending",
    },
    {
      id: 2,
      projectName: "LED Channel Letter Signage",
      coordinator: "Abhay Sindh",
      executive: "Aman",
      paymentStatus: "Pending",
      completionDate: "Nov 15, 2024",
      urgency: "High",
      status: "Pending",
    },
    {
      id: 3,
      projectName: "Acrylic Sign Board",
      coordinator: "Abhay Sindh",
      executive: "Aman",
      paymentStatus: "Pending",
      completionDate: "Nov 15, 2024",
      urgency: "Low",
      status: "Under Process",
    },
    {
      id: 4,
      projectName: "Vinyl Cut Signage",
      coordinator: "Abhay Sindh",
      executive: "Aman",
      paymentStatus: "Full Paid",
      completionDate: "Nov 15, 2024",
      urgency: "Low",
      status: "Completed",
    },
    {
      id: 5,
      projectName: "Glow Sign Board",
      coordinator: "Abhay Sindh",
      executive: "Aman",
      paymentStatus: "Full Paid",
      completionDate: "Nov 15, 2024",
      urgency: "High",
      status: "Completed",
    },
    {
      id: 6,
      projectName: "LED Channel Letter Signage",
      coordinator: "Abhay Sindh",
      executive: "Aman",
      paymentStatus: "Full Paid",
      completionDate: "Nov 15, 2024",
      urgency: "Low",
      status: "Completed",
    },
  ];

  // 2. Configuration for your Table component
  const columnConfig = {
    action: {
      label: "Action",
      render: (_, row) => (
        <button
          onClick={() => setOpenPlanningLogId(row.id)}
          className="bg-blue-600 p-2 rounded-md text-white hover:bg-blue-700 transition-colors inline-flex items-center justify-center cursor-pointer"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
    status: {
      label: "Status",
      render: (value) => {
        let styles = "bg-gray-100 text-gray-600";
        if (value === "Pending") styles = "bg-orange-100 text-orange-400";
        else if (value === "Under Process")
          styles = "bg-blue-100 text-blue-600";
        else if (value === "Completed") styles = "bg-green-100 text-green-600";

        return (
          <span
            className={`px-3 py-1 rounded-md text-xs font-semibold ${styles}`}
          >
            {value}
          </span>
        );
      },
    },
    projectName: {
      label: "Project Name",
    },
    coordinator: {
      label: "Project Co- Ordinator",
    },
    executive: {
      label: "Sales Executive",
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    paymentStatus: {
      label: "Payment Status",
      render: (value) => {
        let styles = "bg-gray-100 text-gray-600";
        if (value === "Initial Paid") styles = "bg-blue-100 text-blue-600";
        else if (value === "Pending") styles = "bg-orange-100 text-orange-400";
        else if (value === "Full Paid") styles = "bg-green-100 text-green-600";

        return (
          <span
            className={`px-3 py-1 rounded-md text-xs font-semibold ${styles}`}
          >
            {value}
          </span>
        );
      },
    },
    completionDate: {
      label: "Completion Date",
    },
    urgency: {
      label: "Urgency",
      render: (value) => {
        const styles =
          value === "High" ? "bg-red-700 text-white" : "bg-blue-600 text-white";
        return (
          <span
            className={`px-3 py-1 rounded-md text-xs font-semibold ${styles}`}
          >
            {value}
          </span>
        );
      },
    },
  };

  return (
    <div className="">
      <PlanningLogModal
        isOpen={!!openPlanningLogId}
        onClose={() => setOpenPlanningLogId(null)}
        logs={[]}
      />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
        {/* Title Area */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Sales Department</h1>
        </div>

        {/* Filters Area */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 transition cursor-pointer">
            <SlidersHorizontal size={16} />
            Urgency
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 transition cursor-pointer">
            <Filter size={16} />
            Status
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 transition cursor-pointer">
            <User size={16} />
            Sales Executive
          </button>
        </div>
      </div>

      {/* Reusing your Custom Table Component */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table data={salesData} columnConfig={columnConfig} />
      </div>
    </div>
  );
};

export default SalesDepartment;
