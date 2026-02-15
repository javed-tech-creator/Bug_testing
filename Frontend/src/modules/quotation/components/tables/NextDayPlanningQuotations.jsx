import React from "react";
import Table from "@/components/Table";
import { Lightbulb, ChevronDown, Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NextDayPlanningQuotations = () => {
  const navigate = useNavigate();

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
    // Actions → ONLY View
    actions: {
      label: "Actions",
      render: (_val, row) => (
        <div className="flex justify-center items-center">
          <button
            title="View Quotation"
            onClick={() =>
              navigate(`/quotation/quotation-detail/${row._id}`, {
                state: { quotation: row, from: "next-day-planning" },
              })
            }
            className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Eye size={16} />
          </button>
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
    <div>
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
            Next Day Planning Quotations
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* PSL Button */}
          {/* <button
            title="PSL"
            className="flex items-center justify-center px-3 py-2 border bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-all"
            onClick={() => navigate("/quotation/psl")}
          >
            <Lightbulb className="w-4 h-4" />
          </button> */}

          {["Date", "Priority", "Status"].map((f) => (
            <button
              key={f}
              className="flex items-center gap-2 px-4 py-2 border bg-white rounded-md text-sm text-gray-600 hover:shadow-sm transition-all"
            >
              {f} <ChevronDown className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table data={data} columnConfig={columnConfig} />
    </div>
  );
};

export default NextDayPlanningQuotations;
