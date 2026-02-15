import React from "react";
import {
  ArrowLeft,
  ListFilter,
  User,
  Eye,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import Table from "@/components/Table";
import PlanningLogModal from "../components/PlanningLogModal";
import MakePlanningModal from "../components/MakePlanningModal";
import { useNavigate } from "react-router-dom";

const ComplaintsPage = () => {
  const navigate = useNavigate();
  const [openPlanningLogId, setOpenPlanningLogId] = React.useState(null);
  const [openMakePlanningId, setOpenMakePlanningId] = React.useState(null);

  // --- Mock Data: Complaints Table ---
  // Matches rows from the screenshot
  const complaintsData = [
    {
      id: 1,
      customerName: "Flex Sign Board",
      productName: "ACP Reverse Board",
      coordinator: "Abhay Sindh",
      complaintStatus: "Completed",
      complaintDetail: "This is Complaint Details",
      personName: "Manan",
      urgency: "High",
      complaintDate: "11 Nov 25, 10:30AM",
    },
    {
      id: 2,
      customerName: "LED Channel Letter Signage",
      productName: "ACP Reverse Board",
      coordinator: "Abhay Sindh",
      complaintStatus: "Pending",
      complaintDetail: "This is Complaint Details",
      personName: "Manan",
      urgency: "High",
      complaintDate: "11 Nov 25, 10:30AM",
    },
    {
      id: 3,
      customerName: "Acrylic Sign Board",
      productName: "ACP Reverse Board",
      coordinator: "Abhay Sindh",
      complaintStatus: "Completed",
      complaintDetail: "This is Complaint Details",
      personName: "Aman",
      urgency: "Low",
      complaintDate: "11 Nov 25, 10:30AM",
    },
    {
      id: 4,
      customerName: "Vinyl Cut Signage",
      productName: "ACP Reverse Board",
      coordinator: "Abhay Sindh",
      complaintStatus: "Completed",
      complaintDetail: "This is Complaint Details",
      personName: "Aman",
      urgency: "Low",
      complaintDate: "11 Nov 25, 10:30AM",
    },
    {
      id: 5,
      customerName: "Glow Sign Board",
      productName: "ACP Reverse Board",
      coordinator: "Abhay Sindh",
      complaintStatus: "Completed",
      complaintDetail: "This is Complaint Details",
      personName: "Aman",
      urgency: "High",
      complaintDate: "11 Nov 25, 10:30AM",
    },
    {
      id: 6,
      customerName: "LED Channel Letter Signage",
      productName: "ACP Reverse Board",
      coordinator: "Abhay Sindh",
      complaintStatus: "Completed",
      complaintDetail: "This is Complaint Details",
      personName: "Aman",
      urgency: "Low",
      complaintDate: "11 Nov 25, 10:30AM",
    },
  ];

  // --- Mock Data: Waiting Works Table ---
  const waitingData = [
    {
      id: 1,
      department: "Complaint",
      waitingIn: "11 Nov 25, 10:30AM",
      lastInteraction: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "Flex Sign Board",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      status: "Hold by Client",
      priority: 1,
      leadType: "Hot",
    },
    {
      id: 4,
      department: "Complaint",
      waitingIn: "11 Nov 25, 10:30AM",
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
      department: "Complaint",
      waitingIn: "11 Nov 25, 10:30AM",
      lastInteraction: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "Glow Sign Board",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      status: "Hold by Client",
      priority: 5,
      leadType: "Cold",
    },
  ];

  // --- Helpers for Styling ---
  const ActionButtons = ({ row }) => (
    <div className="flex items-center justify-center gap-2">
      <button
      className="p-1.5 bg-gray-200 text-black-700 rounded hover:bg-gray-300 transition shadow-sm cursor-pointer"
      onClick={() => setOpenPlanningLogId(row.id)}
      id={`a${row.id}`}
    >
      <Info size={16} />
    </button>
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

  const UrgencyBadge = ({ value }) => (
    <span
      className={`px-3 py-1 rounded text-xs font-medium text-white ${value === "High" ? "bg-[#D32F2F]" : "bg-[#2563EB]"}`}
    >
      {value}
    </span>
  );

  // --- Column Config: Complaints Table ---
  const complaintsColumns = {
    action: {
      label: "Action",
      render: (_, row) => <ActionButtons row={row} />,
    },
    complaintStatus: {
      label: "Complaint Status",
      render: (val) => {
        const isCompleted = val === "Completed";
        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium ${isCompleted ? "bg-blue-100 text-blue-600" : "bg-orange-50 text-orange-500"}`}
          >
            {val}
          </span>
        );
      },
    },
    customerName: { label: "Customer Name" },
    productName: { label: "Product Name" },
    coordinator: { label: "Project Co- Ordinator" },

    complaintDetail: {
      label: "Complaint Detail",
      render: (val) => (
        <div className="text-gray-700 text-xs w-32 whitespace-normal">
          {val}
        </div>
      ),
    },
    personName: { label: "Person Name" },
    urgency: {
      label: "Urgency",
      render: (val) => <UrgencyBadge value={val} />,
    },
    complaintDate: {
      label: "Complaint Date",
      render: (val) => (
        <div className="w-24 whitespace-normal leading-tight text-left">
          {val}
        </div>
      ),
    },
  };

  // --- Column Config: Waiting Works Table ---
  const waitingColumns = {
    action: {
      label: "Action",
      render: (_, row) => <ActionButtons row={row} />,
    },
    status: {
      label: "Status",
      render: (val) => {
        const isClient = val.includes("Client");
        return (
          <span
            className={`px-2 py-1 rounded text-[11px] font-medium text-white whitespace-nowrap ${isClient ? "bg-[#D32F2F]" : "bg-[#2563EB]"}`}
          >
            {val}
          </span>
        );
      },
    },
    department: { label: "Department" },
    waitingIn: {
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
    // leadType: {
    //   label: "Lead Type",
    //   render: (val) => {
    //     let bgClass = "bg-blue-100 text-blue-600";
    //     if (val === "Hot") bgClass = "bg-red-100 text-red-600";
    //     if (val === "Warm") bgClass = "bg-orange-100 text-orange-600";

    //     return (
    //       <span className={`px-3 py-1 rounded text-xs font-medium ${bgClass}`}>
    //         {val}
    //       </span>
    //     );
    //   },
    // },
  };

  return (
    <div className="">
      {/* ------------------ TABLE 1: COMPLAINTS ------------------ */}

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
          <h1 className="text-xl font-bold text-gray-900">Complaints</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <ListFilter size={16} /> Urgency
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <ListFilter size={16} /> Status
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <User size={16} /> Person Name
          </button>
        </div>
      </div>

      <PlanningLogModal
        isOpen={!!openPlanningLogId}
        onClose={() => setOpenPlanningLogId(null)}
        logs={[]}
      />
      <MakePlanningModal
        isOpen={!!openMakePlanningId}
        onClose={() => setOpenMakePlanningId(null)}
        onSubmit={() => setOpenMakePlanningId(null)}
      />

      {/* Complaints Table */}
      <div className="custom-table-styles mb-8">
        <Table data={complaintsData} columnConfig={complaintsColumns} />
      </div>

      {/* ------------------ TABLE 2: WAITING WORKS ------------------ */}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mt-8 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Waiting Works</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <ListFilter size={16} /> Urgency
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <ListFilter size={16} /> Status
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <User size={16} /> Recce Executive
          </button>
        </div>
      </div>

      {/* Waiting Table */}
      <div className="custom-table-styles">
        <Table data={waitingData} columnConfig={waitingColumns} />
      </div>
    </div>
  );
};

export default ComplaintsPage;
