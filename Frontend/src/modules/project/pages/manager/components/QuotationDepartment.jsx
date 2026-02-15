import React from "react";
import Table from "@/components/Table";
import { ArrowLeft, ChevronDown, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManagerQuotationDepartment = () => {
  const navigate = useNavigate();

  const data = [
    {
      id: 1,
      clientName: "Aman",
      projectName: "Flex Sign Board",
      productCount: 5,
      workType: "Fresh",
      plannedBy: "Abhay Sindh",
      planningDate: "Nov 15, 2024 - 10:00 AM",
      executive: "Hariom",
      urgency: "High",
      priority: 1,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "On Track",
    },
    {
      id: 2,
      clientName: "Abhay",
      projectName: "LED Channel Letter Signage",
      productCount: 7,
      workType: "Repairing",
      plannedBy: "Abhay Sindh",
      planningDate: "Nov 15, 2024 - 10:00 AM",
      executive: "Hariom",
      urgency: "High",
      priority: 2,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Hold By Company",
    },
    {
      id: 3,
      clientName: "Akhil",
      projectName: "Acrylic Sign Board",
      productCount: 70,
      workType: "Fresh",
      plannedBy: "Abhay Sindh",
      planningDate: "Nov 15, 2024 - 10:00 AM",
      executive: "Hariom",
      urgency: "Low",
      priority: 3,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Hold By Client",
    },
    {
      id: 4,
      clientName: "Avinash",
      projectName: "Vinyl Cut Signage",
      productCount: 15,
      workType: "Repairing",
      plannedBy: "Abhay Sindh",
      planningDate: "Nov 15, 2024 - 10:00 AM",
      executive: "Hariom",
      urgency: "Low",
      priority: 4,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "Hold By Client",
    },
    {
      id: 5,
      clientName: "Anil",
      projectName: "Glow Sign Board",
      productCount: 56,
      workType: "Fresh",
      plannedBy: "Abhay Sindh",
      planningDate: "Nov 15, 2024 - 10:00 AM",
      executive: "Hariom",
      urgency: "High",
      priority: 5,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "On Track",
    },
    {
      id: 6,
      clientName: "Aryan",
      projectName: "LED Channel Letter Signage",
      productCount: 12,
      workType: "Fresh",
      plannedBy: "Abhay Sindh",
      planningDate: "Nov 15, 2024 - 10:00 AM",
      executive: "Hariom",
      urgency: "Low",
      priority: 6,
      deadline: "Nov 15, 2024 - 10:00 AM",
      completionDate: "Nov 15, 2024",
      status: "On Track",
    },
  ];

  const columnConfig = {
    clientName: { label: "Client Name" },
    projectName: { label: "Project Name" },
    productCount: { label: "Product Count" },

    workType: {
      label: "Type of work",
      render: (val) => {
        const styles = {
          Fresh: "bg-blue-50 text-blue-600",
          Repairing: "bg-orange-50 text-orange-500",
        };
        return (
          <span className={`px-3 py-1 rounded text-xs font-medium ${styles[val]}`}>
            {val}
          </span>
        );
      },
    },

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
    executive: { label: "Quotation Executive" },

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
    deadline: { label: "Quotation Deadline" },
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
            Quotation Department
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

export default ManagerQuotationDepartment;
