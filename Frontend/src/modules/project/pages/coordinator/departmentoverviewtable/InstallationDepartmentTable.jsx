import React, { useState } from "react";
import Table from "@/components/Table";  // Ensure this path points to your Table.jsx file
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

const InstallationDepartmentTable = () => {
  const navigate = useNavigate();
  const [openPlanningLogId, setOpenPlanningLogId] = useState(null);
  // 1. Mock Data matching the Installation Department Screenshot
  const [data] = useState([
    {
      id: 1,
      productName: "Flex Sign Board",
      projectName: "Flex Sign Board",
      coordinator: "Abhay Sindh",
      installationExecutive: "Anil Singh",
      urgency: "High",
      time: "10:00 AM",
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Pending",
    },
    {
      id: 2,
      productName: "Flex Sign Board",
      projectName: "LED Channel Letter Signage",
      coordinator: "Abhay Sindh",
      installationExecutive: "Aman",
      urgency: "High",
      time: "10:00 AM",
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Done",
    },
    {
      id: 3,
      productName: "Flex Sign Board",
      projectName: "Acrylic Sign Board",
      coordinator: "Abhay Sindh",
      installationExecutive: "Aman",
      urgency: "Low",
      time: "10:00 AM",
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Done",
    },
    {
      id: 4,
      productName: "Flex Sign Board",
      projectName: "Vinyl Cut Signage",
      coordinator: "Abhay Sindh",
      installationExecutive: "Anil Singh",
      urgency: "Low",
      time: "10:00 AM",
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Pending",
    },
    {
      id: 5,
      productName: "Flex Sign Board",
      projectName: "Glow Sign Board",
      coordinator: "Abhay Sindh",
      installationExecutive: "Anil Singh",
      urgency: "High",
      time: "10:00 AM",
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Pending",
    },
    {
      id: 6,
      productName: "Flex Sign Board",
      projectName: "LED Channel Letter Signage",
      coordinator: "Abhay Sindh",
      installationExecutive: "Aman",
      urgency: "Low",
      time: "10:00 AM",
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
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
        // Matching the specific "Pending" and "Done" badges from the screenshot
        if (value === "Pending") styles = "bg-[#FFF8E6] text-[#D97706]"; // Light Orange/Yellow
        if (value === "Done") styles = "bg-[#ECFDF5] text-[#10B981]"; // Light Green

        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${styles}`}
          >
            {value}
          </span>
        );
      },
    },
    productName: { label: "Product Name" },
    projectName: { label: "Project Name" },
    coordinator: { label: "Project Co- Ordinator" },
    installationExecutive: { label: "Installation Executive" },

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

    time: { label: "Time" },
    deadline: { label: "Installation Deadline" },
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
            Installation Department
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
            <User size={16} /> Installation Executive
          </button>
        </div>
      </div>

      {/* --- Table Component Integration --- */}
      <Table data={data} columnConfig={columnConfig} />
    </div>
  );
};

export default InstallationDepartmentTable;
