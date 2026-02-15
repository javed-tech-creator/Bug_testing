import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../../../components/Table";
import PageHeader from "@/components/PageHeader";
import { Eye } from "lucide-react";
import { useGetRejectedRecceQuery } from "../../../../../api/admin/assignedRecce.api";

function RejectedRecceProjectList() {
  const navigate = useNavigate();

  const { data: recceData, isLoading } = useGetRejectedRecceQuery();

  const handleViewClick = (id) => {
    navigate(`/recce/recce-details/${id}`);
  };

  const columnConfig = {
    projectName: { label: "Project Name" },
    client: { label: "Client" },
    address: { label: "Address" },
    status: {
      label: "Status",
      render: () => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-red-50 text-red-600 border-red-100">
          Rejected
        </span>
      ),
    },
    reason: { label: "Rejection Reason" },
    action: {
      label: "Action",
      render: (value, row) => (
        <button
          onClick={() => handleViewClick(row.id)}
          className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all duration-200 shadow-sm"
          title="View Details"
        >
          <Eye size={16} strokeWidth={2} />
        </button>
      ),
    },
  };

  const formattedData =
    recceData?.data?.projects?.map((item) => ({
      id: item._id,
      projectName: item.projectName,
      client: item?.clientId?.name || "N/A",
      address: item.address || "N/A",
      status: item.status,
      reason: item?.reviewSubmit?.reworkInstructions || "No reason provided",
    })) || [];

  if (isLoading) return <div className="p-4">Loading rejected recces...</div>;

  return (
    <div className="p-4">
      <PageHeader title="Rejected Recce Projects" />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table data={formattedData} columnConfig={columnConfig} />
        </div>
      </div>
    </div>
  );
}

export default RejectedRecceProjectList;
