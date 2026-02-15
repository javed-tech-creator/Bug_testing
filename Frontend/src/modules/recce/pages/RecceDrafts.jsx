import React, { useState } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  Filter,
  Search,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import PageHeader from "../../../components/PageHeader";
import { useGetTotalRecceQuery } from "../../../api/admin/assignedRecce.api";
import { toast } from "react-toastify";

const RecceDrafts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  const { data: recceData, isLoading } = useGetTotalRecceQuery();

  const handleViewDetails = (item) => {
    navigate(`/recce/assigned-recce-details/${item.id}`);
  };

  const handleEditDraft = (item) => {
    navigate(`/recce/recce-details/${item.id}`);
  };

  const handleDeleteDraft = (item) => {
    if (window.confirm(`Delete draft for ${item.projectName}?`)) {
      toast.info(`Draft deleted for ${item.projectName}`);
      // Add delete logic here
    }
  };

  // Filter for drafts/in-design items
  const filteredData =
    recceData?.data?.projects?.filter((item) => {
      const matchesSearch =
        item.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clientName?.toLowerCase().includes(searchTerm.toLowerCase());

      const isDraft =
        item.status === "pending" || item.status === "in_progress";

      return matchesSearch && isDraft;
    }) || [];

  const columnConfig = {
    projectName: {
      label: "Project Name",
      sortable: true,
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{value}</span>
          <span className="text-xs text-gray-500">{row.clientName}</span>
        </div>
      ),
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
    progress: {
      label: "Progress",
      render: (value, row) => {
        const progressPercent = row.progressPercent || 45;
        return (
          <div className="flex items-center gap-2">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium text-gray-600">
              {progressPercent}%
            </span>
          </div>
        );
      },
    },
    lastModified: {
      label: "Last Modified",
      render: (value) => {
        const date = value ? new Date(value) : new Date();
        const hours = Math.floor(
          (Date.now() - date.getTime()) / (1000 * 60 * 60)
        );
        return (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock size={14} />
            {hours === 0 ? "Recently" : `${hours}h ago`}
          </div>
        );
      },
    },
    priority: {
      label: "Priority",
      render: (value) => {
        const priorityColors = {
          high: "text-red-600 bg-red-50",
          medium: "text-orange-600 bg-orange-50",
          low: "text-green-600 bg-green-50",
        };
        const priority = value || "medium";
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              priorityColors[priority] || priorityColors.medium
            }`}
          >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        );
      },
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
            onClick={() => handleEditDraft(row)}
            className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Edit Draft"
          >
            <Edit2 size={18} className="text-yellow-600" />
          </button>
          <button
            onClick={() => handleDeleteDraft(row)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Draft"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      ),
    },
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Recce in Design"
        description="Manage draft recce reports that are still in progress"
      />

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 space-y-4">
        <div className="flex gap-4 flex-wrap items-center">
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
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Drafts Table */}
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
            <p>No draft recce reports found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecceDrafts;
