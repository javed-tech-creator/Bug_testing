import React from "react";
import {
  ArrowLeft,
  Search,
  ListFilter,
  User,
  Eye,
  FileEdit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Table from "@/components/Table";
import PlanningLogModal from "../components/PlanningLogModal";
import RecceModal from "../components/RecceModal";

const AssignedProjects = () => {
  const [openPlanningLogId, setOpenPlanningLogId] = React.useState(null);
  const [openRecceModalId, setOpenRecceModalId] = React.useState(null);
  const navigate = useNavigate();
  // 1. Mock Data matching the screenshot
  const projectData = [
    {
      id: 1,
      projectName: "Flex Sign Board",
      clientName: "Tech Sol.",
      coordinator: "Abhay Sindh",
      salesPerson: "Aman",
      completionDate: "Nov 15, 2024",
      urgency: "High",
      status: "Fresh",
      statusByRecce: "Accepted",
    },
    {
      id: 2,
      projectName: "LED Channel Letter Signage",
      clientName: "TCS",
      coordinator: "Abhay Sindh",
      salesPerson: "Aman",
      completionDate: "Nov 15, 2024",
      urgency: "High",
      status: "Repeated",
      statusByRecce: "Accepted",
    },
    {
      id: 3,
      projectName: "Acrylic Sign Board",
      clientName: "HCL",
      coordinator: "Abhay Sindh",
      salesPerson: "Aman",
      completionDate: "Nov 15, 2024",
      urgency: "Low",
      status: "Repeated",
      statusByRecce: "Declined",
    },
    {
      id: 4,
      projectName: "Vinyl Cut Signage",
      clientName: "Vipro",
      coordinator: "Abhay Sindh",
      salesPerson: "Aman",
      completionDate: "Nov 15, 2024",
      urgency: "Low",
      status: "Fresh",
      statusByRecce: "Flag Raised",
    },
   
    {
      id: 5,
      projectName: "Glow Sign Board",
      clientName: "Tech Mahi.",
      coordinator: "Abhay Sindh",
      salesPerson: "Aman",
      completionDate: "Nov 15, 2024",
      urgency: "High",
      status: "Fresh",
        statusByRecce: "Declined",
    },
    {
      id: 6,
      projectName: "LED Channel Letter Signage",
      clientName: "Aman Chawla",
      coordinator: "Abhay Sindh",
      salesPerson: "Aman",
      completionDate: "Nov 15, 2024",
      urgency: "Low",
      status: "Fresh",
      statusByRecce: "Flag Raised",
    },
  ];

  // 2. Column Configuration
  const columnConfig = {
    action: {
      label: "Action",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="p-1.5 bg-[#2563EB] text-white rounded hover:bg-blue-700 transition cursor-pointer"
            onClick={() => navigate("/project/flex-sign-board")}
          
          >
            <Eye size={16} />
          </button>
          <button
            className="p-1.5 bg-[#F59E0B] text-white rounded hover:bg-yellow-600 transition cursor-pointer"
            onClick={() => setOpenRecceModalId(row.id)}
            id={`recce${row.id}`}
          >
            <FileEdit size={16} />
          </button>
        </div>
      ),
    },
    status: {
      label: "Status",
      render: (value) => {
        const isFresh = value === "Fresh";
        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium ${isFresh ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-400"}`}
          >
            {value}
          </span>
        );
      },
    },
    projectName: {
      label: "Project Name",
      render: (value, row) => (
        <button
          onClick={() => navigate("/project/flex-sign-board")}
          className="text-blue-600 hover:underline font-medium text-left cursor-pointer"
        >
          {value}
        </button>
      ),
    },
    clientName: { label: "Client Name" },
    statusByRecce: {
      label: "Status By Recce",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded text-xs font-medium ${value === "Accepted" ? "bg-blue-100 text-blue-600" : value === "Declined" ? "bg-orange-100 text-orange-400" : "bg-red-100 text-red-500"}`}
        >
          {value}
        </span>
      ),
    },
    coordinator: { label: "Project Co- Ordinator" },
    salesPerson: { label: "Sales Person" },
    completionDate: { label: "Completion Date" },
    urgency: {
      label: "Urgency",
      render: (value) => {
        const isHigh = value === "High";
        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium text-white ${isHigh ? "bg-[#D32F2F]" : "bg-[#1976D2]"}`}
          >
            {value}
          </span>
        );
      },
    },
  };

  return (
    <div className="">
      {/* PlanningLogModal */}
      <PlanningLogModal
        isOpen={!!openPlanningLogId}
        onClose={() => setOpenPlanningLogId(null)}
        logs={[]}
      />
      <RecceModal
        isOpen={!!openRecceModalId}
        onClose={() => setOpenRecceModalId(null)}
      />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
        {/* Title Area */}
        <div className="flex items-center gap-4 ">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Assigned Projects</h1>
        </div>

        {/* Filters Area */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}

          {/* Buttons */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 transition cursor-pointer">
            <ListFilter size={16} />
            Urgency
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 transition cursor-pointer">
            <ListFilter size={16} />{" "}
            {/* Using ListFilter as generic filter icon */}
            Status
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 transition cursor-pointer">
            <User size={16} />
            Co- Ordinator's
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="custom-table-styles">
        <Table data={projectData} columnConfig={columnConfig} />
      </div>
    </div>
  );
};

export default AssignedProjects;
