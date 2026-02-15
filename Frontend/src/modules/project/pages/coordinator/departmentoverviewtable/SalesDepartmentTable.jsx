import React, { useState } from "react";
import Table from "@/components/Table"; // Ensure this path points to your Table.jsx file
import { ArrowLeft, Search, Eye, User, Filter, LayoutList } from "lucide-react";
import PlanningLogModal from "../components/PlanningLogModal";
import { useNavigate } from "react-router-dom";

const SalesDepartmentTable = () => {
  const navigate = useNavigate();
  const [openPlanningLogId, setOpenPlanningLogId] = useState(null);
  // 1. Mock Data matching the Sales Department Screenshot
  const [data] = useState([
    {
      id: 1,
      projectName: "Flex Sign Board",
      coordinator: "Abhay Sindh",
      salesExecutive: "Aman",
      paymentStatus: "Initial Paid",
      completionDate: "Nov 15, 2024",
      urgency: "High",
      status: "Pending",
    },
    {
      id: 2,
      projectName: "LED Channel Letter Signage",
      coordinator: "Abhay Sindh",
      salesExecutive: "Aman",
      paymentStatus: "Pending",
      completionDate: "Nov 15, 2024",
      urgency: "High",
      status: "Pending",
    },
    {
      id: 3,
      projectName: "Acrylic Sign Board",
      coordinator: "Abhay Sindh",
      salesExecutive: "Aman",
      paymentStatus: "Pending",
      completionDate: "Nov 15, 2024",
      urgency: "Low",
      status: "Under Process",
    },
    {
      id: 4,
      projectName: "Vinyl Cut Signage",
      coordinator: "Abhay Sindh",
      salesExecutive: "Aman",
      paymentStatus: "Full Paid",
      completionDate: "Nov 15, 2024",
      urgency: "Low",
      status: "Completed",
    },
    {
      id: 5,
      projectName: "Glow Sign Board",
      coordinator: "Abhay Sindh",
      salesExecutive: "Aman",
      paymentStatus: "Full Paid",
      completionDate: "Nov 15, 2024",
      urgency: "High",
      status: "Completed",
    },
    {
      id: 6,
      projectName: "LED Channel Letter Signage",
      coordinator: "Abhay Sindh",
      salesExecutive: "Aman",
      paymentStatus: "Full Paid",
      completionDate: "Nov 15, 2024",
      urgency: "Low",
      status: "Completed",
    },
  ]);

  // 2. Column Configuration
  const columnConfig = {
    action: {
      label: "Action",
      render: (_, row) => (
        <button
          className="bg-[#2563EB] hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors cursor-pointer"
          onClick={() => setOpenPlanningLogId(row.id)}
        >
          <Eye size={16} />
        </button>
      ),
    },

    status: {
      label: "Status",
      render: (value) => {
        let styles = "bg-gray-100 text-gray-600";
        if (value === "Pending") styles = "bg-[#FFF8E6] text-[#D97706]";
        if (value === "Under Process") styles = "bg-[#E6F0FF] text-[#2563EB]";
        if (value === "Completed") styles = "bg-[#ECFDF5] text-[#10B981]";

        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${styles}`}
          >
            {value}
          </span>
        );
      },
    },
    projectName: { label: "Project Name" },
    coordinator: { label: "Project Co- Ordinator" },
    salesExecutive: { label: "Sales Executive" },

    // New Column: Payment Status
    paymentStatus: {
      label: "Payment Status",
      render: (value) => {
        let styles = "bg-gray-100 text-gray-600";
        if (value === "Initial Paid") styles = "bg-[#E6F0FF] text-[#2563EB]"; // Light Blue
        if (value === "Pending") styles = "bg-[#FFF8E6] text-[#D97706]"; // Light Orange/Yellow
        if (value === "Full Paid") styles = "bg-[#ECFDF5] text-[#10B981]"; // Light Green

        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${styles}`}
          >
            {value}
          </span>
        );
      },
    },

    completionDate: { label: "Completion Date" },

    urgency: {
      label: "Urgency",
      render: (value) => {
        const isHigh = value === "High";
        return (
          <span
            className={`px-3 py-1 rounded text-white text-xs font-medium ${
              isHigh ? "bg-[#C92A2A]" : "bg-[#2563EB]"
            }`}
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
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

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <LayoutList size={16} /> Urgency
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <Filter size={16} /> Status
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <User size={16} /> Sales Executive
          </button>
        </div>
      </div>

      {/* --- Table Component Integration --- */}
      <Table data={data} columnConfig={columnConfig} />
    </div>
  );
};

export default SalesDepartmentTable;
