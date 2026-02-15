import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@/components/Table";
import { ArrowLeft, ChevronDown, Eye } from "lucide-react";

const DeclinedQuotations = () => {
  const navigate = useNavigate();
  // 1. Data based on the Declined Quotations screenshot
  const data = [
    {
      id: 1,
      clientName: "GreenFields Co.",
      project: "Retails Store Signage",
      products: 12,
      declinedDate: "11 Nov 25, 10:30AM",
      priorityT: "High",
      priorityN: "High (1)",
      status: "Declined",
      deadline: "11 Nov 25, 11:30AM",
      declineReason: "Budget constraints",
    },
    {
      id: 2,
      clientName: "AgriMart",
      project: "Mall Facade Design's",
      products: 23,
      declinedDate: "11 Nov 25, 10:30AM",
      priorityT: "High",
      priorityN: "High (2)",
      status: "Declined",
      deadline: "11 Nov 25, 11:30AM",
      declineReason: "Chose another vendor",
    },
    {
      id: 3,
      clientName: "SunHarvest",
      project: "Office Branding Survey",
      products: 32,
      declinedDate: "11 Nov 25, 10:30AM",
      priorityT: "Medium",
      priorityN: "Medium (3)",
      status: "Declined",
      deadline: "11 Nov 25, 11:30AM",
      declineReason: "Project postponed",
    },
    {
      id: 4,
      clientName: "FreshStore",
      project: "Retails Store Signage",
      products: 12,
      declinedDate: "11 Nov 25, 10:30AM",
      priorityT: "Medium",
      priorityN: "Medium (4)",
      status: "Declined",
      deadline: "11 Nov 25, 11:30AM",
      declineReason: "Requirements changed",
    },
    {
      id: 5,
      clientName: "SunHarvest",
      project: "Mall Facade Design's",
      products: 32,
      declinedDate: "11 Nov 25, 10:30AM",
      priorityT: "Low",
      priorityN: "Low (5)",
      status: "Declined",
      deadline: "11 Nov 25, 11:30AM",
      declineReason: "Timeline mismatch",
    },
    {
      id: 6,
      clientName: "AgroHub",
      project: "Office Branding Survey",
      products: 22,
      declinedDate: "11 Nov 25, 10:30AM",
      priorityT: "Low",
      priorityN: "Low (6)",
      status: "Declined",
      deadline: "11 Nov 25, 11:30AM",
      declineReason: "No response from client",
    },
  ];

  // 2. Column configuration matching the new layout
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  const handleViewReason = (reason) => {
    setSelectedReason(reason);
    setModalOpen(true);
  };

  const columnConfig = {
    declineReason: {
      label: "Actions",
      render: (val, row) => (
        <button
          title="View Decline Reason"
          onClick={() =>
            navigate(`/quotation/quotation-detail/${row.id}`, {
              state: {
                from: "declined",
              },
            })
          }
            className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors cursor-pointer"
  
        >
          <Eye size={16} />
        </button>
      ),
    },
    // S.No. is handled by Table.jsx, so start with actions for correct order
    // actions: {
    //   label: "Actions",
    //   render: (_, row) => (
    //     <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors shadow-sm">
    //       <Eye className="w-4 h-4" />
    //     </button>
    //   ),
    // },
    status: {
      label: "Status",
      render: (val) => (
        <span className="px-3 py-1 rounded border border-red-100 bg-red-50 text-red-400 text-xs font-medium">
          {val}
        </span>
      ),
    },
    clientName: { label: "Client Name" },
    project: { label: "Project Name" },
    products: { label: "Products" },
    declinedDate: { label: "Declined Date" },
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
            className={`px-3 py-1 rounded border text-xs font-medium ${styles[val]}`}
          >
            {val}
          </span>
        );
      },
    },
    priorityN: {
      label: "Priority (N)",
      render: (val) => {
        const styles = {
          "High (1)": "bg-red-50 text-red-500 border-red-100",
          "High (2)": "bg-red-50 text-red-500 border-red-100",
          "Medium (3)": "bg-orange-50 text-orange-400 border-orange-100",
          "Medium (4)": "bg-orange-50 text-orange-400 border-orange-100",
          "Low (5)": "bg-green-50 text-green-500 border-green-100",
          "Low (6)": "bg-green-50 text-green-500 border-green-100",
        };
        return (
          <span
            className={`px-3 py-1 rounded border text-xs font-medium ${styles[val]}`}
          >
            {val}
          </span>
        );
      },
    },

    deadline: { label: "Deadline" },
  };

  return (
    <div className="">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate(-1)}
            className="p-2 border rounded-md cursor-pointer hover:bg-gray-100 bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Declined Quotations
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {["Date", "Priority", "Status"].map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white text-sm text-gray-600 hover:border-blue-400 transition-all cursor-pointer"
            >
              {filter} <ChevronDown className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Reusable Table Component */}
      <Table data={data} columnConfig={columnConfig} />

      {/* Modal for Decline Reason */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            {/* Header */}
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Decline Reason</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="
                  flex items-center justify-center
                  w-7 h-7
                  text-2xl font-medium
                  text-gray-500
                  bg-gray-100
                  rounded-full
                  hover:bg-gray-200
                  hover:text-black
                  transition
                  cursor-pointer
                "
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Reason</label>
                <textarea
                  rows={4}
                  value={selectedReason}
                  readOnly
                  className="w-full border rounded-md px-3 py-2 bg-gray-50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeclinedQuotations;
