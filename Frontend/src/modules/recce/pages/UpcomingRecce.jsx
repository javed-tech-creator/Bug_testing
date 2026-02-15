import React, { useState, useMemo } from "react";
import { Eye, CopyPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import PageHeader from "@/components/PageHeader";
import RequestModal from "@/modules/quotation/components/LostModal";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import { useGetRecceExeUpcomingQuery } from "@/api/recce/executive/recce-exe-upcoming/recce-exe-upcoming.api";

const UpcomingRecce = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);


  const {
    data: upcomingData,
    isLoading,
    isFetching,
    error,
  } = useGetRecceExeUpcomingQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  


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
      render: (val, row) => (
        <div className="flex justify-center items-center gap-2">
          {/* Eye - View */}
          <button
            title="View Details"
            className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={() =>
              navigate(`/recce/recce-details/${row._id}`, {
                state: { recce: row, from: "upcoming" },
              })
            }
          >
            <Eye size={16} />
          </button>

          {/* CopyPlus - Lost Quotation */}

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
      label: "Full Address",
      render: (_, row) => (
        <button
          onClick={() => {
            const query = encodeURIComponent(row.address);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
          }}
          className="text-blue-600 font-medium hover:underline cursor-pointer text-left"
          title="Open address in new tab"
        >
          {row.address}
        </button>
      ),
    },

    priority: {
      label: "Priority",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${value === "High"
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
      label: "Priority By Number",
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
      <DesignSimpleHeader title="Upcoming Recce" />
      <Table data={filteredData} columnConfig={columnConfig} />
      <RequestModal
        isOpen={isModalOpen}
        selectedRow={selectedRow}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(remark) => {
          console.log("Selected Row:", selectedRow);
          console.log("Submitted Remark:", remark);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default UpcomingRecce;
