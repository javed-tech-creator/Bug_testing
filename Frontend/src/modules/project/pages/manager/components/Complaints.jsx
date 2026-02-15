import React from "react";
import Table from "@/components/Table";
import { ArrowLeft, ChevronDown, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManagerComplaints = () => {
  const navigate = useNavigate();

  const data = [
    {
      id: 1,
      customerName: "Flex Sign Board",
      productName: "ACP Reverse Board",
      plannedBy: "Abhay Sindh",
      planningDate: "11 Nov 25, 10:30AM",
      status: "On Track",
      personName: "Manan",
      urgency: "High",
      complaintDate: "11 Nov 25, 10:30AM",
    },
    {
      id: 2,
      customerName: "LED Channel Letter Signage",
      productName: "ACP Reverse Board",
      plannedBy: "Abhay Sindh",
      planningDate: "11 Nov 25, 10:30AM",
      status: "Hold By Company",
      personName: "Manan",
      urgency: "High",
      complaintDate: "11 Nov 25, 10:30AM",
    },
    {
      id: 3,
      customerName: "Acrylic Sign Board",
      productName: "ACP Reverse Board",
      plannedBy: "Abhay Sindh",
      planningDate: "11 Nov 25, 10:30AM",
      status: "On Track",
      personName: "Aman",
      urgency: "Low",
      complaintDate: "11 Nov 25, 10:30AM",
    },
    {
      id: 4,
      customerName: "Vinyl Cut Signage",
      productName: "ACP Reverse Board",
      plannedBy: "Abhay Sindh",
      planningDate: "11 Nov 25, 10:30AM",
      status: "On Track",
      personName: "Aman",
      urgency: "Low",
      complaintDate: "11 Nov 25, 10:30AM",
    },
    {
      id: 5,
      customerName: "Glow Sign Board",
      productName: "ACP Reverse Board",
      plannedBy: "Abhay Sindh",
      planningDate: "11 Nov 25, 10:30AM",
      status: "On Track",
      personName: "Aman",
      urgency: "High",
      complaintDate: "11 Nov 25, 10:30AM",
    },
    {
      id: 6,
      customerName: "LED Channel Letter Signage",
      productName: "ACP Reverse Board",
      plannedBy: "Abhay Sindh",
      planningDate: "11 Nov 25, 10:30AM",
      status: "On Track",
      personName: "Aman",
      urgency: "Low",
      complaintDate: "11 Nov 25, 10:30AM",
    },
  ];

  const columnConfig = {
    customerName: { label: "Customer Name" },
    productName: { label: "Product Name" },

    plannedBy: {
      label: "Planned By",
      render: (val) => (
        <div>
          <div className="font-medium">{val}</div>
          <div className="text-xs text-blue-600">Project Co-Ordinator</div>
        </div>
      ),
    },

    planningDate: { label: "Planning Date" },

    status: {
      label: "Status",
      render: (val) => {
        const styles = {
          "On Track": "bg-blue-50 text-blue-600",
          "Hold By Company": "bg-orange-50 text-orange-500",
        };
        return (
          <span className={`px-3 py-1 rounded text-xs font-medium ${styles[val]}`}>
            {val}
          </span>
        );
      },
    },

    personName: { label: "Person Name" },

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

    complaintDate: { label: "Complaint Date" },

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
            ManagerComplaints
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* <input
            type="text"
            placeholder="Search here"
            className="px-4 py-2 bg-slate-100 rounded text-sm w-60 focus:outline-none"
          /> */}

          {["Urgency", "Status", "Person Name"].map((f) => (
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

export default ManagerComplaints;
