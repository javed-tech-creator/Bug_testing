import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ListFilter,
  User,
  Eye,
  SlidersHorizontal,
  Flag,
} from "lucide-react";
import Table from "@/components/Table";
import PlanningLogModal from "../components/PlanningLogModal";
import MakePlanningModal from "../components/MakePlanningModal";

const WaitingWorkPage = () => {
  const navigate = useNavigate();
  // --- Mock Data: Waiting Work Table ---
  // Matches rows from the provided screenshot
  const waitingWorkData = [
    {
      id: 1,
      department: "Recce",
      waitingInDate: "11 Nov 25, 10:30AM",
      lastInteraction: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "Flex Sign Board",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      status: "Hold by Client",
      priority: 1,
      leadType: "Hot",
    },
    {
      id: 2,
      department: "Design",
      waitingInDate: "11 Nov 25, 10:30AM",
      lastInteraction: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "LED Channel Letter Signage",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      status: "Hold by Client",
      priority: 2,
      leadType: "Hot",
    },
    {
      id: 3,
      department: "Production",
      waitingInDate: "11 Nov 25, 10:30AM",
      lastInteraction: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "Acrylic Sign Board",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      status: "Hold by Company",
      priority: 3,
      leadType: "Hot",
    },
    {
      id: 4,
      department: "Installation",
      waitingInDate: "11 Nov 25, 10:30AM",
      lastInteraction: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "Vinyl Cut Signage",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      status: "Hold by Company",
      priority: 4,
      leadType: "Warm",
    },
    {
      id: 5,
      department: "PR",
      waitingInDate: "11 Nov 25, 10:30AM",
      lastInteraction: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "Glow Sign Board",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      status: "Hold by Client",
      priority: 5,
      leadType: "Cold",
    },
    {
      id: 6,
      department: "Quotation",
      waitingInDate: "11 Nov 25, 10:30AM",
      lastInteraction: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "LED Channel Letter Signage",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      status: "Hold by Company",
      priority: 6,
      leadType: "Cold",
    },
  ];

  // --- Helpers for Styling ---
  const [openPlanningLogId, setOpenPlanningLogId] = React.useState(null);
  const [openMakePlanningId, setOpenMakePlanningId] = React.useState(null);
  const ActionButtons = (value, row) => (
    <div className="flex items-center justify-center gap-2">
      <button
        className="p-1.5 bg-[#2563EB] text-white rounded hover:bg-blue-700 transition shadow-sm cursor-pointer"
        onClick={() => setOpenPlanningLogId(row.id)}
        id={`a${row.id}`}
      >
        <Eye size={16} />
      </button>
      <button
        className="p-1.5 bg-[#F59E0B] text-white rounded hover:bg-orange-600 transition shadow-sm cursor-pointer"
        onClick={() => setOpenMakePlanningId(row.id)}
        id={`makePlanning${row.id}`}
      >
        <SlidersHorizontal size={16} />
      </button>
    </div>
  );

  const StatusBadge = ({ value }) => {
    // "Hold by Client" is Red, "Hold by Company" is Blue
    const isClient = value.includes("Client");
    return (
      <span
        className={`px-3 py-1 rounded text-xs font-medium text-white ${isClient ? "bg-[#D32F2F]" : "bg-[#2563EB]"}`}
      >
        {value}
      </span>
    );
  };

  const LeadTypeBadge = ({ value }) => {
    let styles = "bg-gray-100 text-gray-600";
    if (value === "Hot")
      styles = "bg-red-50 text-red-500 border border-red-100";
    if (value === "Warm")
      styles = "bg-orange-50 text-orange-500 border border-orange-100";
    if (value === "Cold")
      styles = "bg-blue-50 text-blue-500 border border-blue-100";

    return (
      <span className={`px-3 py-1 rounded text-xs font-medium ${styles}`}>
        {value}
      </span>
    );
  };

  // --- Column Config ---
  const columns = {
    action: {
      label: "Action",
      render: ActionButtons,
    },
    status: {
      label: "Status",
      render: (val) => <StatusBadge value={val} />,
    },
    department: { label: "Department" },
    waitingInDate: {
      label: "Waiting In Date",
      render: (val) => (
        <div className="w-24 whitespace-normal text-left">{val}</div>
      ),
    },
    lastInteraction: {
      label: "Last Interaction",
      render: (val) => (
        <div className="w-24 whitespace-normal text-left">{val}</div>
      ),
    },
    productName: { label: "Product Name" },
    projectName: { label: "Project Name" },
    waitingTime: {
      label: "Waiting Time",
      render: (val) => (
        <div className="w-24 whitespace-normal text-left text-xs">{val}</div>
      ),
    },

    priority: { label: "Priority" },
    leadType: {
      label: "Lead Type",
      render: (val) => <LeadTypeBadge value={val} />,
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
      {/* MakePlanningModal */}
      <MakePlanningModal
        isOpen={!!openMakePlanningId}
        onClose={() => setOpenMakePlanningId(null)}
        onSubmit={() => setOpenMakePlanningId(null)}
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
          <h1 className="text-xl font-bold text-gray-900">Waiting Work</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filters matching the screenshot */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <ListFilter size={16} /> Status
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <Flag size={16} /> Flag Type
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <User size={16} /> Department
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="custom-table-styles">
        <Table data={waitingWorkData} columnConfig={columns} />
      </div>
    </div>
  );
};

export default WaitingWorkPage;
