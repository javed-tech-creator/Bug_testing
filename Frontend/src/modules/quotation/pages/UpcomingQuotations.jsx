import React, { useState, useMemo } from "react";
import { Eye, CopyPlus, ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import RequestModal from "@/modules/quotation/components/LostModal";
import { toast } from "react-toastify";

const UpcomingQuotations = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Dummy Upcoming Quotations Data
  const [data] = useState([
    {
      _id: "1",
      clientName: "GreenFields Pvt Ltd",
      clientCity: "Mumbai",
      projectName: "Retail Store Branding",
      address: "24, High Street, Andheri West",
      createdAt: "2025-01-15T10:30:00Z",
      priority: "High",
    },
    {
      _id: "2",
      clientName: "AgroMart",
      clientCity: "Delhi",
      projectName: "Mall Facade Signage",
      address: "Sector 18, Noida",
      createdAt: "2025-01-16T11:00:00Z",
      priority: "Medium",
    },
    {
      _id: "3",
      clientName: "FreshStore",
      clientCity: "Bengaluru",
      projectName: "Office Branding",
      address: "MG Road, Bengaluru",
      createdAt: "2025-01-17T09:45:00Z",
      priority: "Low",
    },
  ]);

  const filteredData = useMemo(() => data, [data]);

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (_, row) => (
        <div className="flex justify-center items-center gap-2">
          {/* View Quotation */}
          <button
            title="View Quotation"
            className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            onClick={() =>
              navigate(`/quotation/upcoming-quotations/${row._id}`, {
                state: { quotation: row, from: "upcoming" },
              })
            }
          >
            <Eye size={16} />
          </button>

          {/* Request Modification */}
          <button
            title="Request Modification"
            className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded border border-orange-100 hover:bg-orange-100 transition-colors text-xs font-semibold cursor-pointer"
            onClick={() => {
              setSelectedRow(row);
              setIsModalOpen(true);
            }}
          >
            <CopyPlus size={18} />
          </button>
        </div>
      ),
    },

    status: {
      label: "Status",
      render: () => (
        <span className="px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
          Upcoming
        </span>
      ),
    },

    client: {
      label: "Client",
      render: (_, row) => (
        <span className="font-medium text-gray-900">{row.clientName}</span>
      ),
    },

    project: {
      label: "Project",
      render: (_, row) => (
        <span className="text-gray-700">{row.projectName}</span>
      ),
    },

    fullAddress: {
      label: "Address",
      render: (_, row) => (
        <span className="text-gray-800 font-medium">{row.address}</span>
      ),
    },

    priority: {
      label: "Priority",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            value === "High"
              ? "bg-red-50 text-red-600 border-red-100"
              : value === "Medium"
                ? "bg-orange-50 text-orange-600 border-orange-100"
                : "bg-green-50 text-green-600 border-green-100"
          }`}
        >
          {value}
        </span>
      ),
    },

    priorityNumber: {
      label: "Priority No.",
      render: (_, row) => {
        const map = {
          High: 1,
          Medium: 2,
          Low: 3,
        };

        return (
          <span className="px-3 py-1 rounded-md text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200">
            {map[row.priority] ?? "-"}
          </span>
        );
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => navigate(-1)}
            className="p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Upcoming Quotations
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {["Date", "Priority", "Status"].map((f) => (
            <button
              key={f}
              className="flex items-center gap-2 px-4 py-2 border bg-white rounded-md text-sm text-gray-600 hover:shadow-sm"
            >
              {f} <ChevronDown className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      <Table data={filteredData} columnConfig={columnConfig} />

      <RequestModal
        isOpen={isModalOpen}
        selectedRow={selectedRow}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(remark) => {
          toast.success("Modification request submitted successfully!");
          console.log("Quotation:", selectedRow);
          console.log("Remark:", remark);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default UpcomingQuotations;
