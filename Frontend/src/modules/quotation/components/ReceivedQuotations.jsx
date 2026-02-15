import React, { useState } from "react";
import Table from "@/components/Table";
import { Lightbulb, ChevronDown, ClipboardList, ArrowLeft, Info, Eye, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SelfTeamToggle from "@/modules/recce/components/SelfTeamToggle";
import AssignedQuotationModal from "./AssignedQuotationModal";

const ReceivedQuotations = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("self");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  const handleAssignQuotation = (item) => {
    setSelectedQuotation(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuotation(null);
  };
  
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
  const data = [
    {
      id: 1,
      clientName: "GreenFields Co.",
      project: "Retails Store Signage",
      products: 12,
      assignedDate: "11 Nov 25, 10:30AM",
      priorityT: "High",
      priorityN: "High (1)",
      status: "Pending",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 2,
      clientName: "AgriMart",
      project: "Mall Facade Design's",
      products: 23,
      assignedDate: "11 Nov 25, 10:30AM",
      priorityT: "High",
      priorityN: "High (2)",
      status: "Pending",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 3,
      clientName: "SunHarvest",
      project: "Office Branding Survey",
      products: 32,
      assignedDate: "11 Nov 25, 10:30AM",
      priorityT: "Medium",
      priorityN: "Medium (3)",
      status: "Pending",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 4,
      clientName: "FreshStore",
      project: "Retails Store Signage",
      products: 12,
      assignedDate: "11 Nov 25, 10:30AM",
      priorityT: "Medium",
      priorityN: "Medium (4)",
      status: "Pending",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 5,
      clientName: "SunHarvest",
      project: "Mall Facade Design's",
      products: 32,
      assignedDate: "11 Nov 25, 10:30AM",
      priorityT: "Low",
      priorityN: "Low (5)",
      status: "Pending",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 6,
      clientName: "AgroHub",
      project: "Office Branding Survey",
      products: 22,
      assignedDate: "11 Nov 25, 10:30AM",
      priorityT: "Low",
      priorityN: "Low (6)",
      status: "Pending",
      deadline: "11 Nov 25, 11:30AM",
    },
  ];

  const columnConfig = {
    // S.No. is handled by Table.jsx, so start with actions for correct order
    actions: {
      label: "Actions",
      render: (_val, row) => (
        <div className="flex items-center gap-2">
          <button
            title="View Quotation"
            onClick={() => navigate(`/quotation/quotation-detail/${row.id}`, {
              state: { from: 'received' }
            })}
            className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            <Eye size={16} strokeWidth={2.5} />
          </button>
          {isManager && (
            <button
              title="Re-Assign Quotation"
              onClick={() => handleAssignQuotation(row)}
              className="w-8 h-8 flex items-center justify-center rounded bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer"
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
        <span className="px-4 py-1 rounded border border-orange-100 bg-orange-50 text-orange-400 text-xs font-medium">
          {val}
        </span>
      ),
    },
    clientName: { label: "Client Name" },
    project: { label: "Project Name" },
    products: { label: "Products" },
    assignedDate: { label: "Assigned Date" },
    deadline: { label: "Deadline" },
    priorityT: {
      label: "Priority (T)",
      render: (val) => {
        const styles = {
          High: "bg-red-50 text-red-500 border-red-100",
          Medium: "bg-orange-50 text-orange-400 border-orange-100",
          Low: "bg-green-50 text-green-500 border-green-100",
        };
        return (
          <span
            className={`px-4 py-1 rounded border text-xs font-medium ${styles[val]}`}
          >
            {val}
          </span>
        );
      },
    },
    priorityN: {
      label: "Priority (N)",
      render: (val) => {
        // Extracts "High", "Medium", or "Low" from strings like "High (1)"
        const basePriority = val.split(" ")[0];
        const styles = {
          High: "bg-red-50 text-red-500 border-red-100",
          Medium: "bg-orange-50 text-orange-400 border-orange-100",
          Low: "bg-green-50 text-green-500 border-green-100",
        };
        return (
          <span
            className={`px-4 py-1 rounded border text-xs font-medium ${styles[basePriority]}`}
          >
            {val}
          </span>
        );
      },
    },
  };

  return (
    <div className="">
      {/* Header with Search and Navigation */}
      <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => navigate(-1)}
            className="p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Received Quotations
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* PSL Button */}
          <button
            title="PSL"
            className="flex items-center justify-center px-3 py-2 border bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-all cursor-pointer"
            onClick={() => navigate("/quotation/psl")}
          >
            <Lightbulb className="w-4 h-4" />
          </button>
          {/* <input
            type="text"
            placeholder="Search here"
            className="bg-[#EDEDED] px-4 py-2 rounded-md text-sm w-72 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          /> */}
          {["Date", "Priority", "Status"].map((f) => (
            <button
              key={f}
              className="flex items-center gap-2 px-4 py-2 border bg-white rounded-md text-sm text-gray-600 hover:shadow-sm cursor-pointer transition-all"
            >
              {f} <ChevronDown className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      

      {/* Main Table Container */}
      <Table data={data} columnConfig={columnConfig} />

      {/* Assignment Modal */}
      <AssignedQuotationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        quotationData={selectedQuotation}
        variant="assignment"
      />
    </div>
  );
};

export default ReceivedQuotations;
