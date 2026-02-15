import React from "react";
import Table from "@/components/Table";
import { ArrowLeft, ChevronDown, Eye, FileText, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WaitingQuotations = () => {
  const navigate = useNavigate();
  const data = [
    {
      id: 1,
      clientName: "GreenFields Co.",
      project: "Retails Store Signage",
      products: 12,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "High",
      status: "Hold By Client",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 2,
      clientName: "AgriMart",
      project: "Mall Facade Design's",
      products: 23,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "High",
      status: "Hold By Company",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 3,
      clientName: "SunHarvest",
      project: "Office Branding Survey",
      products: 32,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "Medium",
      status: "Hold By Client",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 4,
      clientName: "FreshStore",
      project: "Retails Store Signage",
      products: 12,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "Medium",
      status: "Hold By Company",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 5,
      clientName: "SunHarvest",
      project: "Mall Facade Design's",
      products: 32,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "Low",
      status: "Hold By Client",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 6,
      clientName: "AgroHub",
      project: "Office Branding Survey",
      products: 22,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "Low",
      status: "Hold By Client",
      deadline: "11 Nov 25, 11:30AM",
    },
  ];

  const columnConfig = {
    // S.No. is handled by Table.jsx, so start with actions for correct order
    actions: {
      label: "Actions",
      render: (_, row) => (
        <div className="flex justify-center gap-2">
          {/* Info Button */}
          <button
            title="View Details"
            onClick={() =>
              navigate(`/quotation/quotation-detail/${row.id}`, {
                state: {
                  from: "waiting",
                },
              })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors cursor-pointer"
 
          >
           <Eye size={16} />
          </button>
        </div>
      ),
    },
    status: {
      label: "Status",
      render: (val) => {
        const isClient = val === "Hold By Client";
        return (
          <span
            className={`px-4 py-1 rounded border text-xs font-medium ${
              isClient
                ? "bg-red-50 text-red-400 border-red-100"
                : "bg-orange-50 text-orange-400 border-orange-100"
            }`}
          >
            {val}
          </span>
        );
      },
    },
    clientName: { label: "Client Name" },
    project: { label: "Project Name" },
    products: { label: "Products" },
    raisedOn: { label: "Raised On" },
    priority: {
      label: "Priority",
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

    deadline: { label: "Deadline" },
  };

  return (
    <div className="">
      {/* Search and Filter Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate(-1)}
            className="p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Waiting Quotations
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

      {/* Reusable Data Table */}
      <Table data={data} columnConfig={columnConfig} />
    </div>
  );
};

export default WaitingQuotations;
