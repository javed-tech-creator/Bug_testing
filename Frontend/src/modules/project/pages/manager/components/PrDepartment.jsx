import React, { useState } from "react";
import Table from "@/components/Table";
import { ArrowLeft, ChevronDown, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PlanningLogModal from "./modals/PlanningLog";

const ManagerPrDepartment = () => {
  const navigate = useNavigate();


  const data = [
    {
      id: 1,
      productName: "Abc Board",
      projectName: "Flex Sign Board",
      plannedBy: "Abhay Sindh",
      planningDate: "Nov 15, 2024 - 10:00 AM",
      workType: "New",
      executive: "SHOBHA",
      urgency: "High",
      priority: 1,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "On Track",
    },
    {
      id: 2,
      productName: "Xyz Signage",
      projectName: "LED Channel Letter Signage",
      plannedBy: "Abhay Sindh",
      planningDate: "Nov 15, 2024 - 10:00 AM",
      workType: "New",
      executive: "UZMA",
      urgency: "High",
      priority: 2,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Hold By Company",
    },
    {
      id: 3,
      productName: "Abc Board",
      projectName: "Acrylic Sign Board",
      plannedBy: "Abhay Sindh",
      planningDate: "Nov 15, 2024 - 10:00 AM",
      workType: "New",
      executive: "SHOBHA",
      urgency: "Low",
      priority: 3,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Hold By Client",
    },
    {
      id: 4,
      productName: "Xyz Signage",
      projectName: "Vinyl Cut Signage",
      plannedBy: "Abhay Sindh",
      planningDate: "Nov 15, 2024 - 10:00 AM",
      workType: "New",
      executive: "UZMA",
      urgency: "Low",
      priority: 4,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "On Track",
    },
    {
      id: 5,
      productName: "Abc Board",
      projectName: "Glow Sign Board",
      plannedBy: "Abhay Sindh",
      planningDate: "Nov 15, 2024 - 10:00 AM",
      workType: "New",
      executive: "SHOBHA",
      urgency: "High",
      priority: 5,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "On Track",
    },
    {
      id: 6,
      productName: "Xyz Signage",
      projectName: "LED Channel Letter Signage",
      plannedBy: "Abhay Sindh",
      planningDate: "Nov 15, 2024 - 10:00 AM",
      workType: "New",
      executive: "UZMA",
      urgency: "Low",
      priority: 6,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "On Track",
    },
  ];

  const columnConfig = {
    productName: { label: "Product Name" },
    projectName: { label: "Project Name" },

    plannedBy: {
      label: "Planned By",
      render: (val) => (
        <div>
          <div className="font-medium">{val}</div>
          <div className="text-xs text-blue-600 cursor-pointer">
            Project Co-Ordinator
          </div>
        </div>
      ),
    },

    planningDate: { label: "Planning Date" },

    workType: {
      label: "Type of work",
      render: (val) => (
        <span className="px-3 py-1 rounded text-xs font-medium bg-blue-50 text-blue-600">
          {val}
        </span>
      ),
    },

    executive: { label: "Design Executive" },

    urgency: {
      label: "Urgency",
      render: (val) => {
        const styles = {
          High: "bg-red-600 text-white",
          Low: "bg-blue-600 text-white",
        };
        return (
          <span className={`px-3 py-1 rounded text-xs font-medium ${styles[val]}`}>
            {val}
          </span>
        );
      },
    },

    priority: { label: "Priority" },
    deadline: { label: "Design Deadline" },
    completionDate: { label: "Completion Date" },

    status: {
      label: "Status",
      render: (val) => {
        const styles = {
          "On Track": "bg-blue-50 text-blue-600",
          "Hold By Company": "bg-orange-50 text-orange-500",
          "Hold By Client": "bg-red-50 text-red-600",
        };
        return (
          <span className={`px-3 py-1 rounded text-xs font-medium ${styles[val]}`}>
            {val}
          </span>
        );
      },
    },

    actions: {
      label: "Action",
      render: () => (
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            <Eye size={14} />
          </button>
          <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600">
            Review
          </button>
        </div>
      ),
    },
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between mb-5 bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 border rounded hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-semibold text-slate-800">
            PR Department
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* <input
            type="text"
            placeholder="Search here"
            className="px-4 py-2 bg-slate-100 rounded text-sm w-60 focus:outline-none"
          /> */}

          {["Urgency", "Status", "Co - Ordinator's"].map((f) => (
            <button
              key={f}
              className="flex items-center gap-2 px-3 py-2 border rounded text-sm text-slate-600 hover:bg-slate-50"
            >
              {f}
              <ChevronDown size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <Table data={data} columnConfig={columnConfig} />



    </div>
  );
};

export default ManagerPrDepartment;
