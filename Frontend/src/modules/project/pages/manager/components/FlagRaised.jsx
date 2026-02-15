import React from "react";
import Table from "@/components/Table";
import { ArrowLeft, ChevronDown, Eye, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManagerFlagRaised = () => {
  const navigate = useNavigate();

  const data = [
    {
      id: 1,
      department: "Sales",
      date: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      flagType: "Blue",
      projectName: "Flex Sign Board",
      raisedBy: {
        name: "Aman Yadav",
        role: "Recce Manager",
      },
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
      raisedBy: {
        name: "UZMA",
        role: "Design Executive",
      },
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
      raisedBy: {
        name: "Anil Singh",
        role: "Production Manager",
      },
      urgency: "Low",
      priority: 3,
      status: "Open",
    },
    {
      id: 4,
      department: "Recce",
      date: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      flagType: "Yellow",
      projectName: "Vinyl Cut Signage",
      raisedBy: {
        name: "Avinash Dubey",
        role: "Installation Executive",
      },
      urgency: "Low",
      priority: 4,
      status: "Open",
    },
    {
      id: 5,
      department: "Design",
      date: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      flagType: "Blue",
      projectName: "Glow Sign Board",
      raisedBy: {
        name: "SHOBHA",
        role: "Design Executive",
      },
      urgency: "High",
      priority: 5,
      status: "Resolved",
    },
    {
      id: 6,
      department: "Installation",
      date: "11 Nov 25, 10:30AM",
      productName: "ABC Product",
      flagType: "Red",
      projectName: "LED Channel Letter Signage",
      raisedBy: {
        name: "Hariom",
        role: "Quotation Executive",
      },
      urgency: "Low",
      priority: 6,
      status: "Resolved",
    },
  ];

  const columnConfig = {
    department: { label: "Department" },
    date: { label: "Date" },
    productName: { label: "Product Name" },

    flagType: {
      label: "Flag Type",
      render: (val) => {
        const styles = {
          Blue: "bg-blue-50 text-blue-600",
          Yellow: "bg-yellow-50 text-yellow-600",
          Red: "bg-red-50 text-red-600",
        };
        return (
          <span className={`px-3 py-1 rounded text-xs font-medium ${styles[val]}`}>
            {val}
          </span>
        );
      },
    },

    projectName: { label: "Project Name" },

    raisedBy: {
      label: "Raised By",
      render: (val) => (
        <div>
          <div className="font-medium">{val.name}</div>
          <div className="text-xs text-blue-600">{val.role}</div>
        </div>
      ),
    },

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

    status: {
      label: "Status",
      render: (val) => {
        const styles = {
          Open: "bg-red-50 text-red-600",
          Resolved: "bg-green-50 text-green-600",
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
      render: (_val, row) =>
        row.status === "Open" ? (
          <button className="bg-red-600 text-white p-2 rounded hover:bg-red-700" onClick={() => { navigate("/project/manager/flag-resolution/"+row?.id) }}>
            <RotateCcw size={14} />
          </button>
        ) : (
          <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            <Eye size={14} />
          </button>
        ),
    },
  };

  return (
    <div>
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
            Flag Raised
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* <input
            type="text"
            placeholder="Search here"
            className="px-4 py-2 bg-slate-100 rounded text-sm w-60 focus:outline-none"
          /> */}

          {["Urgency", "Status", "Flag Type"].map((f) => (
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

export default ManagerFlagRaised;
