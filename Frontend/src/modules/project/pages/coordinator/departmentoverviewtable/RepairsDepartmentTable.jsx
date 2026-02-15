import React, { useState } from "react";
import Table from "@/components/Table";// Ensure this path points to your Table.jsx file
import {
  ArrowLeft,
  Search,
  Eye,
  User,
  Filter,
  AlertCircle,
} from "lucide-react";
import PlanningLogModal from "../components/PlanningLogModal";
import { useNavigate } from "react-router-dom";

const RepairsDepartmentTable = () => {
  const navigate = useNavigate();
  const [openPlanningLogId, setOpenPlanningLogId] = useState(null);
  // 1. Mock Data matching the Repairs Screenshot
  const [data] = useState([
    {
      id: 1,
      customerName: "Flex Sign Board", // Matches content in screenshot
      productName: "ACP Reverse Board",
      coordinator: "Abhay Sindh",
      workCategory: "Repair",
      repairDetail: "Letters Replace",
      repairExecutive: "Manan",
      urgency: "High",
      date: "Nov 15, 2024",
      status: "Done",
    },
    {
      id: 2,
      customerName: "LED Channel Letter Signage",
      productName: "ACP Reverse Board",
      coordinator: "Abhay Sindh",
      workCategory: "Repair",
      repairDetail: "Letters Replace",
      repairExecutive: "Manan",
      urgency: "High",
      date: "Nov 15, 2024",
      status: "Pending",
    },
    {
      id: 3,
      customerName: "Acrylic Sign Board",
      productName: "ACP Reverse Board",
      coordinator: "Abhay Sindh",
      workCategory: "Repair",
      repairDetail: "Letters Replace",
      repairExecutive: "Aman",
      urgency: "Low",
      date: "Nov 15, 2024",
      status: "Done",
    },
    {
      id: 4,
      customerName: "Vinyl Cut Signage",
      productName: "ACP Reverse Board",
      coordinator: "Abhay Sindh",
      workCategory: "Repair",
      repairDetail: "Letters Replace",
      repairExecutive: "Aman",
      urgency: "Low",
      date: "Nov 15, 2024",
      status: "Done",
    },
    {
      id: 5,
      customerName: "Glow Sign Board",
      productName: "ACP Reverse Board",
      coordinator: "Abhay Sindh",
      workCategory: "Repair",
      repairDetail: "Letters Replace",
      repairExecutive: "Aman",
      urgency: "High",
      date: "Nov 15, 2024",
      status: "Done",
    },
    {
      id: 6,
      customerName: "LED Channel Letter Signage",
      productName: "ACP Reverse Board",
      coordinator: "Abhay Sindh",
      workCategory: "Repair",
      repairDetail: "Letters Replace",
      repairExecutive: "Aman",
      urgency: "Low",
      date: "Nov 15, 2024",
      status: "Pending",
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
        // 'Done' is Green, 'Pending' is Orange/Yellow
        if (value === "Done") styles = "bg-[#ECFDF5] text-[#10B981]";
        if (value === "Pending") styles = "bg-[#FFF8E6] text-[#D97706]";

        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${styles}`}
          >
            {value}
          </span>
        );
      },
    },
    customerName: { label: "Customer Name" },
    productName: { label: "Product Name" },
    coordinator: { label: "Project Co- Ordinator" },

    // Work Category Badge
    workCategory: {
      label: "Work Category",
      render: (value) => {
        // Based on screenshot, "Repair" is Light Orange/Yellow
        const styles = "bg-[#FFF8E6] text-[#D97706]";

        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${styles}`}
          >
            {value}
          </span>
        );
      },
    },

    repairDetail: { label: "Repair Detail" },
    repairExecutive: { label: "Repair Executive" },

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

    date: { label: "Date" },
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
          <h1 className="text-xl font-bold text-gray-900">Repairs</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <AlertCircle size={16} /> Urgency
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <Filter size={16} /> Status
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <User size={16} /> Repair Executive
          </button>
        </div>
      </div>

      {/* --- Table Component Integration --- */}
      <Table data={data} columnConfig={columnConfig} />
    </div>
  );
};

export default RepairsDepartmentTable;
