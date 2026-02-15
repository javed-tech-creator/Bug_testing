import React from "react";
import {
  Eye,
  X,
  Check,
  Calendar,
  Flag,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import PageHeader from "../../../components/PageHeader";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";

const TotalRecce = () => {
  const navigate = useNavigate();
  const [params, setParams] = React.useState({ page: 1, limit: 10 });
const isLoading = false;
const recceData = [];
 
  const handleViewDetails = (item) => {
    console.log("Viewing details for:", item);
    navigate(`/recce/assigned-recce-details/${item.id}`);
  };

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (value, row) => {
        return (
          <div className="flex items-center justify-center gap-2">
            {/* View Button - Always visible, Blue Soft Theme */}
            <button
              className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all duration-200 shadow-sm"
              onClick={() => handleViewDetails(row)}
              title="View Details"
            >
              <Eye size={16} strokeWidth={2} />
            </button>
          </div>
        );
      },
    },
    client: { label: "Client" },
    project: { label: "Project" },
    fullAddress: {
      label: "Address",
      render: (value, row) => (
        <div className="text-sm text-gray-900">{row.address}</div>
      ),
    },
    viewMap: {
      label: "Full Address",
      render: (value, row) => {
        if (row.siteLocation) {
          const [lat, lng] = row.siteLocation
            .split(",")
            .map((coord) => coord.trim());
          const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
          return (
            <div className="text-center w-full">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm transition-colors"
              >
                View Map
              </a>
            </div>
          );
        }

        const query = encodeURIComponent(`${row.address} ${row.city}`);
        const fallbackUrl = `https://www.google.com/maps?q=${query}`;

        return (
          <div className="text-center w-full">
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-800 underline text-sm transition-colors"
            >
              View Map (Approx)
            </a>
          </div>
        );
      },
    },
    visitTime: { label: "Visit Time" },
    priority: {
      label: "Priority",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            value === "High"
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
    status: {
      label: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            value === "On Hold"
              ? "bg-blue-50 text-blue-600 border-blue-100"
              : value === "Rejected"
              ? "bg-red-50 text-red-600 border-red-100"
              : "bg-green-50 text-green-600 border-green-100"
          }`}
        >
          {value}
        </span>
      ),
    },
  };

  const formattedData = recceData?.data?.data?.map((item) => {
    const project = item.projectId || {};
    const client = item.clientId || project.clientId || {};

    return {
      id: item._id,
      client: client?.name || "N/A",
      project: project?.projectName || "N/A",
      address: project?.address || "N/A",
      city: client?.city || "",
      visitTime: project?.projectTimeline?.startDate
        ? new Date(project.projectTimeline.startDate).toLocaleString()
        : "Not Scheduled",
      priority:
        item?.recceAssignment?.priority ||
        project?.recceAssignment?.priority ||
        "Medium",
      status: item?.reviewSubmit?.approvalStatus || item.status || "",
      approvalStatus: item?.reviewSubmit?.approvalStatus || "",
      siteLocation: project?.siteLocation || "",
      actions: "",
    };
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load recce projects</div>;

  return (
    <div className="min-h-screen bg-gray-50/50">
   
      <DesignSimpleHeader title="New Recce"  />
      

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table data={formattedData} columnConfig={columnConfig} />
        </div>
      </div>
    </div>
  );
};

export default TotalRecce;
