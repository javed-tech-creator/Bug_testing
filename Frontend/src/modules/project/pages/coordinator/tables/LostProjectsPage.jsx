import React from "react";
import { ArrowLeft, ListFilter, User, Eye, Flag } from "lucide-react";
import Table from "@/components/Table";
import { useNavigate } from "react-router-dom";

const LostProjectsPage = () => {
  const navigate = useNavigate();
  // --- Mock Data: Lost Projects Table ---
  // Matches rows from the provided screenshot
  const lostProjectsData = [
    {
      id: 1,
      department: "Recce",
      lostDate: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "Flex Sign Board",
      lostBy: "Aman Yadav",
      lostByRole: "Recce Manager",
      lead: "Hot",
      priority: 1,
      status: "Rejected By Client",
    },
    {
      id: 2,
      department: "Design",
      lostDate: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "LED Channel Letter Signage",
      lostBy: "UZMA",
      lostByRole: "Design Executive",
      lead: "Hot",
      priority: 2,
      status: "Rejected By Company",
    },
    {
      id: 3,
      department: "Production",
      lostDate: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "Acrylic Sign Board",
      lostBy: "Anil Singh",
      lostByRole: "Production Manager",
      lead: "Cold",
      priority: 3,
      status: "Rejected By Company",
    },
    {
      id: 4,
      department: "Installation",
      lostDate: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "Vinyl Cut Signage",
      lostBy: "Avinash Dubey",
      lostByRole: "Installation Executive",
      lead: "Cold",
      priority: 4,
      status: "Rejected By Client",
    },
    {
      id: 5,
      department: "PR",
      lostDate: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "Glow Sign Board",
      lostBy: "SHOBHA",
      lostByRole: "Design Executive",
      lead: "Warm",
      priority: 5,
      status: "Rejected By Client",
    },
    {
      id: 6,
      department: "Quotation",
      lostDate: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      projectName: "LED Channel Letter Signage",
      lostBy: "Hariom",
      lostByRole: "Quotation Executive",
      lead: "Cold",
      priority: 6,
      status: "Rejected By Company",
    },
  ];

  // --- Helpers for Styling ---
  const LeadBadge = ({ value }) => {
    let styles = "bg-gray-100 text-gray-600";
    if (value === "Hot") styles = "bg-[#D32F2F] text-white"; // Solid Red per screenshot
    if (value === "Warm") styles = "bg-[#F59E0B] text-white"; // Solid Orange per screenshot
    if (value === "Cold") styles = "bg-[#2563EB] text-white"; // Solid Blue per screenshot

    // Actually, looking closer at the screenshot, they appear to be solid backgrounds:
    // Hot = Red bg/white text (or very dark red)
    // Cold = Blue bg/white text
    // Warm = Orange bg/white text
    // Let's adjust to match standard badge style usually seen,
    // but the screenshot specifically has them as rectangular badges with white text (or very light).

    // Re-evaluating screenshot: Hot is Red Bg/White Text. Cold is Blue Bg/White Text. Warm is Orange Bg/White Text.
    return (
      <span
        className={`px-3 py-1 rounded text-xs font-medium text-white ${
          value === "Hot"
            ? "bg-[#c62828]"
            : value === "Warm"
              ? "bg-[#ea580c]"
              : "bg-[#1d4ed8]"
        }`}
      >
        {value}
      </span>
    );
  };

  const StatusBadge = ({ value }) => (
    <span className="px-3 py-1 rounded text-xs font-medium bg-red-50 text-red-500 border border-red-100">
      {value}
    </span>
  );

  // --- Column Config ---
  const columns = {
    action: {
      label: "Action",
      render: () => (
        <button className="p-1.5 bg-[#2563EB] text-white rounded hover:bg-blue-700 transition shadow-sm flex items-center justify-center mx-auto cursor-pointer">
          <Eye size={16} />
        </button>
      ),
    },
    status: {
      label: "Status",
      render: (val) => <StatusBadge value={val} />,
    },
    department: { label: "Department" },
    lostDate: {
      label: "Lost Date",
      render: (val) => (
        <div className="w-32 whitespace-normal leading-tight text-left">
          {val}
        </div>
      ),
    },
    productName: { label: "Product Name" },
    projectName: { label: "Project Name" },
    lostBy: {
      label: "Lost By",
      render: (_, row) => (
        <div className="flex flex-col items-start">
          <span className="font-semibold text-gray-900 text-sm">
            {row.lostBy}
          </span>
          <span className="text-xs text-blue-600">{row.lostByRole}</span>
        </div>
      ),
    },
    lead: {
      label: "Lead",
      render: (val) => <LeadBadge value={val} />,
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
          <h1 className="text-xl font-bold text-gray-900">Lost Projects</h1>
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
        <Table data={lostProjectsData} columnConfig={columns} />
      </div>
    </div>
  );
};

export default LostProjectsPage;
