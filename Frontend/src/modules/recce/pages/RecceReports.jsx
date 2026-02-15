import React, { useState } from "react";
import { Eye, Download, Filter, Search, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import PageHeader from "../../../components/PageHeader";
import { useGetTotalRecceQuery } from "../../../api/admin/assignedRecce.api";
import { toast } from "react-toastify";

const RecceReports = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: recceData, isLoading } = useGetTotalRecceQuery();

  const handleViewDetails = (item) => {
    navigate(`/recce/assigned-recce-details/${item.id}`);
  };

  const handleExportReport = (item) => {
    toast.info(`Exporting report for ${item.projectName}...`);
    // Add export logic here
  };

  const filteredData =
    recceData?.data?.projects?.filter((item) => {
      const matchesSearch =
        item.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clientName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" || item.status === filterStatus;

      return matchesSearch && matchesFilter;
    }) || [];

  const columnConfig = {
    projectName: {
      label: "Project Name",
      sortable: true,
    },
    clientName: {
      label: "Client Name",
      sortable: true,
    },
    location: {
      label: "Location",
      render: (value, row) => (
        <div className="flex items-center gap-1 text-sm">
          <MapPin size={14} className="text-gray-400" />
          {value || "N/A"}
        </div>
      ),
    },
    status: {
      label: "Status",
      render: (value) => {
        const statusColors = {
          completed: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          in_progress: "bg-blue-100 text-blue-800",
          rejected: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[value] || "bg-gray-100 text-gray-800"
            }`}
          >
            {value?.replace(/_/g, " ") || "N/A"}
          </span>
        );
      },
    },
    createdAt: {
      label: "Date",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    actions: {
      label: "Actions",
      render: (value, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={18} className="text-blue-600" />
          </button>
          <button
            onClick={() => handleExportReport(row)}
            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
            title="Export Report"
          >
            <Download size={18} className="text-green-600" />
          </button>
        </div>
      ),
    },
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Recce Reports"
        description="View and manage all submitted recce reports"
      />

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by project or client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredData.length > 0 ? (
          <Table
            data={filteredData}
            columns={Object.keys(columnConfig)}
            columnConfig={columnConfig}
            rowKey="id"
          />
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            <p>No recce reports found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecceReports;
