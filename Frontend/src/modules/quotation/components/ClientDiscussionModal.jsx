import React from "react";
import { X } from "lucide-react";
import Table from "@/components/Table";

const ClientDiscussionModal = ({
  isOpen,
  onClose,
  data = [], // Dynamic Data passed from Parent
  title = "Complete Client Discussion Log", // Dynamic Title (Optional)
}) => {
  if (!isOpen) return null;

  // Configuration specifically for the Discussion Log Table
  const columnConfig = {
    dateTime: { label: "Date & Time" },
    department: { label: "Department" },
    repName: { label: "Representative Name" },
    repDesignation: { label: "Designation" },
    clientRepName: { label: "Client / Representative Name" },
    clientDesignation: { label: "Designation" },
    discussion: {
      label: "Discussion with Client",
      // Specific rendering to handle long text wrapping like the screenshot
      render: (text) => (
        <div className="min-w-[250px] whitespace-normal text-left leading-relaxed">
          {text}
        </div>
      ),
    },
    remarks: {
      label: "Remarks",
      render: (text) => (
        <div className="min-w-[250px] whitespace-normal text-left leading-relaxed">
          {text}
        </div>
      ),
    },
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-[95%]  rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shrink-0">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (Contains the Table) */}
        <div className="flex-1 p-6 overflow-hidden bg-white">
          <Table
            data={data} // Passing the dynamic data to your jQuery Table component
            columnConfig={columnConfig}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDiscussionModal;
