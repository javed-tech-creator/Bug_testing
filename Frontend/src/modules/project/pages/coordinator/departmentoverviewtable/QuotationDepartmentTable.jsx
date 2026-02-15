import React, { useState } from "react";
import Table from "@/components/Table"; // Ensure this path points to your Table.jsx file
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

const QuotationDepartmentTable = () => {
  const navigate = useNavigate();
  const [openPlanningLogId, setOpenPlanningLogId] = useState(null);
  // 1. Mock Data matching the Quotation Department Screenshot
  const [data] = useState([
    {
      id: 1,
      clientName: "Aman",
      projectName: "Flex Sign Board",
      coordinator: "Abhay Sindh",
      productCount: 5,
      typeOfWork: "Fresh",
      quotationExecutive: "Hariom",
      urgency: "High",
      priority: 1,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Pending",
    },
    {
      id: 2,
      clientName: "Abhay",
      projectName: "LED Channel Letter Signage",
      coordinator: "Abhay Sindh",
      productCount: 7,
      typeOfWork: "Repairing",
      quotationExecutive: "Hariom",
      urgency: "High",
      priority: 2,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Completed",
    },
    {
      id: 3,
      clientName: "Akhil",
      projectName: "Acrylic Sign Board",
      coordinator: "Abhay Sindh",
      productCount: 70,
      typeOfWork: "Fresh",
      quotationExecutive: "Hariom",
      urgency: "Low",
      priority: 3,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Pending",
    },
    {
      id: 4,
      clientName: "Avinash",
      projectName: "Vinyl Cut Signage",
      coordinator: "Abhay Sindh",
      productCount: 15,
      typeOfWork: "Repairing",
      quotationExecutive: "Hariom",
      urgency: "Low",
      priority: 4,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Completed",
    },
    {
      id: 5,
      clientName: "Anil",
      projectName: "Glow Sign Board",
      coordinator: "Abhay Sindh",
      productCount: 56,
      typeOfWork: "Fresh",
      quotationExecutive: "Hariom",
      urgency: "High",
      priority: 5,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Completed",
    },
    {
      id: 6,
      clientName: "Aryan",
      projectName: "LED Channel Letter Signage",
      coordinator: "Abhay Sindh",
      productCount: 12,
      typeOfWork: "Fresh",
      quotationExecutive: "Hariom",
      urgency: "Low",
      priority: 6,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
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
    clientName: { label: "Client Name" },
    projectName: { label: "Project Name" },
    coordinator: { label: "Project Co- Ordinator" },
    productCount: { label: "Product Count" },

    // Custom Badge for 'Type of Work' (Fresh vs Repairing)
    typeOfWork: {
      label: "Type of work",
      render: (value) => {
        let styles = "bg-gray-100 text-gray-600";
        if (value === "Fresh") styles = "bg-[#E6F0FF] text-[#2563EB]"; // Light Blue
        if (value === "Repairing") styles = "bg-[#FFF8E6] text-[#D97706]"; // Light Orange/Yellow

        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${styles}`}
          >
            {value}
          </span>
        );
      },
    },

    quotationExecutive: { label: "Quotation Executive" },

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

    priority: { label: "Priority" },

    deadline: { label: "Quotation Deadline" },

    completionDate: { label: "Completion Date" },
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
          <h1 className="text-xl font-bold text-gray-900">
            Quotation Department
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <AlertCircle size={16} /> Urgency
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <Filter size={16} /> Status
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <User size={16} /> Quotation Executive
          </button>
        </div>
      </div>

      {/* --- Table Component Integration --- */}
      <Table data={data} columnConfig={columnConfig} />
    </div>
  );
};

export default QuotationDepartmentTable;
