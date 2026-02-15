import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "@/components/Table";
import { Search, ChevronDown, ArrowLeft, Flag, Eye } from "lucide-react";

const FlagRaisedQuotations = () => {
  const navigate = useNavigate();
  // 1. Define your data
  const data = [
    {
      id: 1,
      clientName: "GreenFields Co.",
      projectName: "Retails Store Signage",
      products: 12,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "High",
      flagType: "Red",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 2,
      clientName: "AgriMart",
      projectName: "Mall Facade Design's",
      products: 23,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "High",
      flagType: "Yellow",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 3,
      clientName: "SunHarvest",
      projectName: "Office Branding Survey",
      products: 32,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "Medium",
      flagType: "Closed",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 4,
      clientName: "FreshStore",
      projectName: "Retails Store Signage",
      products: 12,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "Medium",
      flagType: "Yellow",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 5,
      clientName: "SunHarvest",
      projectName: "Mall Facade Design's",
      products: 32,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "Low",
      flagType: "Closed",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 6,
      clientName: "AgroHub",
      projectName: "Office Branding Survey",
      products: 22,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "Low",
      flagType: "Yellow",
      deadline: "11 Nov 25, 11:30AM",
    },
  ];

  // 2. Define the configuration for your Table component
  const columnConfig = {
    // S.No. is handled by Table.jsx, so start with actions for correct order
    actions: {
      label: "Actions",
      render: (_, row) => (
        <div className="flex justify-center">
          <button
            title="Flag Escalate Detail Page"
            onClick={() =>
              navigate(`/quotation/quotation-detail/${row.id}`, {
                state: {
                  from: "flagRaised",
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
    clientName: { label: "Client Name" },
    projectName: { label: "Project Name" },
    products: {
      label: "Products",
      render: (val) => <span className="font-bold">{val}</span>,
    },
    raisedOn: { label: "Raised On" },
    priority: {
      label: "Priority",
      render: (val) => {
        const styles = {
          High: "bg-red-50 text-red-500 border-red-100",
          Medium: "bg-orange-50 text-orange-500 border-orange-100",
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
    flagType: {
      label: "Flag Type",
      render: (val) => {
        const styles = {
          Red: "bg-red-50 text-red-500 border-red-100",
          Yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
          Closed: "bg-red-50 text-red-400 border-red-100",
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
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate(-1)}
            className="p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Flag Raised Quotations
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["Date", "Priority", "Flag Type", "Status"].map((f) => (
            <button
              key={f}
              className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white text-sm text-gray-600 cursor-pointer hover:border-blue-400 transition-all"
            >
              {f} <ChevronDown className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Your Custom Table Component */}
      <Table data={data} columnConfig={columnConfig} />
    </div>
  );
};

export default FlagRaisedQuotations;
