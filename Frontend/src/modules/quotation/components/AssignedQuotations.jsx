import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Table from "@/components/Table";
import { Eye, ArrowLeft, ChevronDown, UserCheck } from "lucide-react";
import AssignedQuotationModal from "./AssignedQuotationModal";
import SelfTeamToggle from "@/modules/recce/components/SelfTeamToggle";
const AssignedQuotations = () => {
  const navigate = useNavigate();

  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const role = user?.designation?.title?.toLowerCase();

  const normalizedRole =
    {
      executive: "executive",
      "quotation executive": "executive",
      manager: "manager",
      "quotation manager": "manager",
      hod: "manager",
      "quotation hod": "manager",
    }[role] || "executive";

  const isManager = normalizedRole === "manager";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [viewMode, setViewMode] = useState("self");

  const handleAssignQuotation = (item) => {
    setSelectedQuotation(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuotation(null);
  };

  // 1. Data matching the screenshot
  const quotationsData = [
    {
      id: 1,
      client: "GreenFields Co.",
      project: "Retails Store Signage",
      products: 12,
      date: "11 Nov 25, 10:30AM",
      priorityT: "High",
      priorityN: "High (1)",
      status: "New",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 2,
      client: "AgriMart",
      project: "Mall Facade Design's",
      products: 23,
      date: "11 Nov 25, 10:30AM",
      priorityT: "High",
      priorityN: "High (2)",
      status: "New",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 3,
      client: "SunHarvest",
      project: "Office Branding Survey",
      products: 32,
      date: "11 Nov 25, 10:30AM",
      priorityT: "Medium",
      priorityN: "Medium (3)",
      status: "New",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 4,
      client: "FreshStore",
      project: "Retails Store Signage",
      products: 12,
      date: "11 Nov 25, 10:30AM",
      priorityT: "Medium",
      priorityN: "Medium (4)",
      status: "New",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 5,
      client: "SunHarvest",
      project: "Mall Facade Design's",
      products: 32,
      date: "11 Nov 25, 10:30AM",
      priorityT: "Low",
      priorityN: "Low (5)",
      status: "New",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 6,
      client: "AgroHub",
      project: "Office Branding Survey",
      products: 22,
      date: "11 Nov 25, 10:30AM",
      priorityT: "Low",
      priorityN: "Low (6)",
      status: "New",
      deadline: "11 Nov 25, 11:30AM",
    },
  ];

  // 2. Configuration for your Table component
  const columnConfig = {
actions: {
  label: "Actions",
  render: (val, row) => (
    <div className="flex items-center justify-center gap-2 w-full h-full">
      <button
        title="Assigned Quotation Detail Page"
        className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
        onClick={() =>
          navigate(`/quotation/assigned-quotations/${row.id}`, {
            state: { from: "assigned" },
          })
        }
      >
        <Eye size={16} strokeWidth={2.5} />
      </button>

      {isManager && (
        <button
          title="Re-Assign Quotation"
          className="w-8 h-8 flex items-center justify-center rounded bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer"
          onClick={() => handleAssignQuotation(row)}
        >
          <UserCheck size={16} strokeWidth={2.5} />
        </button>
      )}
    </div>
  ),
},

    status: {
      label: "Status",
      render: (val) => (
        <span className="px-4 py-1 bg-blue-50 text-blue-500 border border-blue-200 rounded-md text-xs font-medium">
          {val}
        </span>
      ),
    },
    client: { label: "Client Name" },
    project: { label: "Project Name" },
    products: { label: "Products" },
    date: { label: "Date" },
    priorityT: {
      label: "Priority (T)",
      render: (val) => <PriorityBadge value={val} />,
    },
    priorityN: {
      label: "Priority (N)",
      render: (val) => <PriorityBadge value={val} />,
    },

    deadline: { label: "Deadline" },
  };

  return (
    <div className="">
      {/* Header UI */}
      <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => navigate(-1)}
            className="p-2 border rounded-md cursor-pointer hover:bg-gray-100 bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Assigned Quotations
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown label="Date" />
          <FilterDropdown label="Priority" />
          <FilterDropdown label="Status" />
        </div>
      </div>

       {isManager && (
        <div className="flex justify-center mb-6">
          <SelfTeamToggle value={viewMode} onChange={setViewMode} />
        </div>
      )}

      {/* Your Provided Table Component */}
      <Table data={quotationsData} columnConfig={columnConfig} />
 
      {/* Assignment Modal */}
      <AssignedQuotationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        quotationData={selectedQuotation}
        
      />
    </div>
  );
};

/**
 * Helper component for Priority Badges
 */
const PriorityBadge = ({ value }) => {
  let styles = "bg-green-50 text-green-600 border-green-200"; // Low
  if (value.toLowerCase().includes("high")) {
    styles = "bg-red-50 text-red-600 border-red-200";
  } else if (value.toLowerCase().includes("medium")) {
    styles = "bg-yellow-50 text-yellow-600 border-yellow-200";
  }

  return (
    <span
      className={`px-3 py-1 border rounded-md text-xs font-medium inline-block min-w-[70px] ${styles}`}
    >
      {value}
    </span>
  );
};

/**
 * Helper component for Filter Dropdowns
 */
const FilterDropdown = ({ label }) => (
  <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white hover:bg-gray-50 shadow-sm cursor-pointer">
    {label} <ChevronDown size={14} className="text-gray-400" />
  </button>
);

export default AssignedQuotations;
