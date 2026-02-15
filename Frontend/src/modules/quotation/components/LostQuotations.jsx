import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@/components/Table";
import { ArrowLeft, ChevronDown, CopyPlus, Eye } from "lucide-react";
import RequestModal from "./LostModal";

const LostQuotations = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const data = [
    {
      id: 1,
      clientName: "GreenFields Co.",
      project: "Retails Store Signage",
      products: 12,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "High",
      reason: "Lost By Client",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 2,
      clientName: "AgriMart",
      project: "Mall Facade Design's",
      products: 23,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "High",
      reason: "Lost By Company",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 3,
      clientName: "SunHarvest",
      project: "Office Branding Survey",
      products: 32,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "Medium",
      reason: "Lost By Client",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 4,
      clientName: "FreshStore",
      project: "Retails Store Signage",
      products: 12,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "Medium",
      reason: "Lost By Company",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 5,
      clientName: "SunHarvest",
      project: "Mall Facade Design's",
      products: 32,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "Low",
      reason: "Lost By Client",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: 6,
      clientName: "AgroHub",
      project: "Office Branding Survey",
      products: 22,
      raisedOn: "11 Nov 25, 10:30AM",
      priority: "Low",
      reason: "Lost By Client",
      deadline: "11 Nov 25, 11:30AM",
    },
  ];

 const handleActionClick = (row) => {
  navigate(`/quotation/quotation-detail/${row.id}`, {
    state: {
      from: "lost",     
    },
  });
};


  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  const handleModalSubmit = (remark) => {
    // You can handle the remark here (e.g., send to API)
    setModalOpen(false);
    setSelectedRow(null);
  };

  const columnConfig = {
    // S.No. is handled by Table.jsx, so start with actions for correct order
    actions: {
      label: "Actions",
      render: (val, row) => (
       <button
  title="Lost Quotation"
 className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors cursor-pointer"
        
  onClick={() => handleActionClick(row)}
>
   <Eye size={16} />
</button>

      ),
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
    reason: {
      label: "Reason",
      render: (val) => {
        const isClient = val === "Lost By Client";
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
    deadline: { label: "Deadline" },
  };

  return (
    <div className="">
      {/* Header section with back button and filters */}
      <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => navigate(-1)}
            className="p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Lost Quotations</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {["Date", "Priority", "Status"].map((f) => (
            <button
              key={f}
              className="flex items-center gap-2 px-4 py-2 border bg-white rounded-md text-sm text-gray-600 cursor-pointer hover:shadow-sm transition-all"
            >
              {f} <ChevronDown className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      <Table data={data} columnConfig={columnConfig} />
      <RequestModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        selectedRow={selectedRow}
      />
    </div>
  );
};

export default LostQuotations;
