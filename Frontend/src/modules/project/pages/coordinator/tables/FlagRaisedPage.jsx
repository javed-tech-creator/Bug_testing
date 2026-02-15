import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ListFilter, User, Eye, History, Flag } from "lucide-react";
import Table from "@/components/Table";

const FlagRaisedPage = () => {
  const navigate = useNavigate();
  // --- Mock Data: Flag Raised Table ---
  // Matches rows from the screenshot
  const flagData = [
    {
      id: 1,
      department: "Recce",
      date: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      flagType: "Blue",
      projectName: "Flex Sign Board",
      raisedBy: "Aman Yadav",
      raisedByRole: "Recce Manager",
      urgency: "High",
      priority: 1,
      status: "Open",
    },
    {
      id: 2,
      department: "Design",
      date: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      flagType: "Yellow",
      projectName: "LED Channel Letter Signage",
      raisedBy: "UZMA",
      raisedByRole: "Design Executive",
      urgency: "High",
      priority: 2,
      status: "Open",
    },
    {
      id: 3,
      department: "Production",
      date: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      flagType: "Blue",
      projectName: "Acrylic Sign Board",
      raisedBy: "Anil Singh",
      raisedByRole: "Production Manager",
      urgency: "Low",
      priority: 3,
      status: "Open",
    },
    {
      id: 4,
      department: "Installation",
      date: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      flagType: "Yellow",
      projectName: "Vinyl Cut Signage",
      raisedBy: "Avinash Dubey",
      raisedByRole: "Installation Executive",
      urgency: "Low",
      priority: 4,
      status: "Open",
    },
    {
      id: 5,
      department: "PR",
      date: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      flagType: "blue", // Lowercase in screenshot row 5
      projectName: "Glow Sign Board",
      raisedBy: "SHOBHA",
      raisedByRole: "Design Executive",
      urgency: "High",
      priority: 5,
      status: "Resolved",
    },
    {
      id: 6,
      department: "Quotation",
      date: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      flagType: "Red",
      projectName: "LED Channel Letter Signage",
      raisedBy: "Hariom",
      raisedByRole: "Quotation Executive",
      urgency: "Low",
      priority: 6,
      status: "Resolved",
    },
  ];

  // --- Helpers for Styling ---
  const UrgencyBadge = ({ value }) => (
    <span
      className={`px-3 py-1 rounded text-xs font-medium text-white ${value === "High" ? "bg-[#D32F2F]" : "bg-[#2563EB]"}`}
    >
      {value}
    </span>
  );

  const FlagTypeBadge = ({ value }) => {
    let styles = "bg-gray-100 text-gray-600";
    const type = value.toLowerCase();

    if (type === "blue") styles = "bg-blue-100 text-blue-600";
    if (type === "yellow") styles = "bg-amber-100 text-amber-600";
    if (type === "red") styles = "bg-red-100 text-red-600";

    return (
      <span
        className={`px-3 py-1 rounded text-xs font-medium capitalize ${styles}`}
      >
        {value}
      </span>
    );
  };

  const StatusBadge = ({ value }) => {
    const isOpen = value === "Open";
    return (
      <span
        className={`px-3 py-1 rounded text-xs font-medium ${isOpen ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}
      >
        {value}
      </span>
    );
  };

  // --- Column Config ---
  const columns = {
    action: {
      label: "Action",
      render: (_, row) => {
        if (row.status === "Open") {
          return (
            <button
              className="p-1.5 bg-[#B71C1C] text-white rounded hover:bg-red-800 transition shadow-sm flex items-center justify-center mx-auto cursor-pointer"
              onClick={() => navigate(`flag-resolution/${row.id}`)}
              id={`flagResolution${row.id}`}
            >
              <History size={16} />
            </button>
          );
        }
        return (
          <button
            className="p-1.5 bg-gray-300 text-gray-500 rounded cursor-not-allowed shadow-sm flex items-center justify-center mx-auto"
            disabled
            title="Resolved flag – view disabled"
          >
            <Eye size={16} />
          </button>
        );
      },
    },
    status: {
      label: "Status",
      render: (val) => <StatusBadge value={val} />,
    },
    department: { label: "Department" },
    date: {
      label: "Date",
      render: (val) => (
        <div className="w-32 whitespace-normal leading-tight text-left">
          {val}
        </div>
      ),
    },
    productName: { label: "Product Name" },
    flagType: {
      label: "Flag Type",
      render: (val) => <FlagTypeBadge value={val} />,
    },
    projectName: { label: "Project Name" },
    raisedBy: {
      label: "Raised By",
      render: (_, row) => (
        <div className="flex flex-col items-start">
          <span className="font-semibold text-gray-900 text-sm">
            {row.raisedBy}
          </span>
          <span className="text-xs text-blue-600">{row.raisedByRole}</span>
        </div>
      ),
    },
    urgency: {
      label: "Urgency",
      render: (val) => <UrgencyBadge value={val} />,
    },
    priority: { label: "Priority" },
  };

  return (
    <div className="">
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
          <h1 className="text-xl font-bold text-gray-900">Flag Raised</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
            <ListFilter size={16} /> Urgency
          </button>
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
        <Table data={flagData} columnConfig={columns} />
      </div>
    </div>
  );
};

export default FlagRaisedPage;
